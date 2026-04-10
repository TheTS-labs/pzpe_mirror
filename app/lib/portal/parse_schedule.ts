import sanitizeHtml from "sanitize-html";

export interface Lesson {
    subject: {
        full: string;
        short: string;
        type: string;
    };
    date: {
        start: string;
        end: string;
    };
    teacher: string;
    notice: string;
}

export interface Schedule {
    [date: string]: Lesson[]
}

export default function parseSchedule(html: string) {
    const events = getEventsVariable(html);

    const cleaned = Object.values(events).map((event: any) => ({
        subject: {
            full: event.disciplineFullName.trim(),
            short: event.disciplineShortName.trim(),
            type: event.typeStr,
        },

        date: {
            date: event.date,
            start: event.timeStart,
            end: event.timeEnd,
        },

        teacher: event.teachersName,
        notice: sanitizeHtml(event.notice !== "" ? event.notice : event.info, {
            allowedTags: [ "br" ],
            allowedAttributes: { }
        }).replaceAll("<br />", "\n")
    }));

    return cleaned.reduce((acc, item) => {
        const groupKey = item.date.date;
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }

        delete item.date.date;
        acc[groupKey].push(item);

        return acc;
    }, {} as Schedule);
}

function getEventsVariable(html: string) {
    const regex = /var events = ({[\s\S]*?});\s*(?:jQuery|(?:\/\/)|$)/;
    const match = html.match(regex);

    if (!match) {
        throw new Error("Could not find `events` variable in the HTML")
    }

    const jsonString = match[1];
    return JSON.parse(jsonString || "");
}