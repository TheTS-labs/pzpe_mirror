export interface Lesson<T = string> {
    subject: {
        full: string;
        short: string;
        type: string;
    };
    time: {
        start: T;
        end: T;
    };
    teacher: string;
    classroom: string;
    notice: string;
}

export interface Schedule {
    [date: string]: Lesson[]
}

export default function parseSchedule(events: { [key: string]: Event }) {
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
        classroom: event.classroom.replace("ауд. ", ""),
        notice: stripTags(event.notice !== "" ? event.notice : event.info)
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

export class GetEventsElementHandler implements HTMLRewriterElementContentHandlers {
    events: { [key: string]: Event } | undefined = undefined;

    #buffer = "";
    #readingVariable = false;

    text(element: Text) {
        if (this.events) { return; }

        this.#buffer += element.text;

        const opening = this.#buffer.indexOf("var events = ");
        if (opening != -1) {
            this.#readingVariable = true;
            this.#buffer = this.#buffer.slice(opening + 13, this.#buffer.length);
        }

        const closing = this.#buffer.indexOf("}};");
        if (closing != -1 && this.#readingVariable) {
            this.events = JSON.parse(this.#buffer.slice(0, closing + 2))
        }
    }
}

function stripTags(str: string) {
    return str
        .replace(/<\/?br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "");
}
