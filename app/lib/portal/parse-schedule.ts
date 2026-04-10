import sanitizeHtml from "sanitize-html";

export interface Lesson {
    subject: {
        full: string;
        short: string;
        type: string;
    };
    time: {
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

    const cleaned = Object.values(events).map(event => ({
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
        const { date: { date, ...time }, ...props } = item;

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push({ ...props, time });

        return acc;
    }, {} as Schedule);
}

interface Event {
    r1: number;
    rz14: number;
    rz15: number;
    disciplineId: number;
    educationDisciplineId: number;
    disciplineFullName: string;
    disciplineShortName: string;
    classroom: string;
    timeStart: string;
    timeEnd: string;
    teachersName: string;
    teachersNameFull: string;
    teacherP1: number;
    type: string;
    typeStr: string;
    dateUpdated: string;
    nonstandardTime: boolean;
    groups: string;
    chairName: string;
    extraText: boolean;
    lessonYear: number;
    semester: number;
    notice: string;
    info: string;
    date: string;
    text: string;
}

function getEventsVariable(html: string): { [key: string]: Event } {
    const regex = /var events = ({[\s\S]*?});\s*(?:jQuery|(?:\/\/)|$)/;
    const match = html.match(regex);

    if (!match) {
        throw new Error("Could not find `events` variable in the HTML")
    }

    const jsonString = match[1];
    return JSON.parse(jsonString || "");
}
