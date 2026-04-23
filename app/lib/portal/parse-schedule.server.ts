import sanitizeHtml from "sanitize-html";
import PortalError from "./portal-error.server";
import { EVENTS_REGEX } from "./constants.server";

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
        classroom: event.classroom.replace("ауд. ", ""),
        notice: sanitizeHtml(event.notice !== "" ? event.notice : event.info, {
            allowedTags: [ "br" ],
            allowedAttributes: { },
        }).replaceAll("<br />", "\n"),
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
    const match = html.match(EVENTS_REGEX);

    if (!match) {
        throw new PortalError("schedule_parsing_failed");
    }

    const jsonString = match[1];
    return JSON.parse(jsonString || "");
}
