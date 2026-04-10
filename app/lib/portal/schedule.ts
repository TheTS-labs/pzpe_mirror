import * as cheerio from "cheerio";
import { TIME_TABLE_URL, getOptions } from ".";
import { type InitPortal } from "./init";
import parseSchedule, { type Schedule as Inner } from "./parse-schedule";

const GROUP_SELECTOR = "#timetableform-groupid";
const STUDENT_SELECTOR = "#timetableform-studentid";

export type Req = {
    course: string,
    facultyId: string,
    groupId?: string
    studentId?: string
} & Pick<InitPortal, "csrfToken" | "metaCsrfToken" | "cookies">;

export interface Schedule {
    groups: [number, string][],
    students: [number, string][],
    
    // TODO: Change naming
    schedule: Inner | undefined
};

function createRequest(req: Req): RequestInit {
    const body = new FormData();

    body.set("_csrf-frontend", req.csrfToken);
    body.set("TimeTableForm[facultyId]", req.facultyId);
    body.set("TimeTableForm[course]", req.course);

    if (req.groupId) { body.set("TimeTableForm[groupId]", req.groupId); }
    if (req.studentId) { body.set("TimeTableForm[studentId]", req.studentId); }

    return {
        method: "POST",
        body,
        headers: {
            "X-CSRF-Token": req.metaCsrfToken,
            "Cookie": req.cookies,
        }
    };
}

export default async function getSchedule(req: Req): Promise<Schedule> {
    const res = await fetch(TIME_TABLE_URL, createRequest(req));

    const html = await res.text();
    const $ = cheerio.load(html);

    const schedule = req.groupId && req.studentId ? parseSchedule(html) : undefined;

    return {
        groups: getOptions($, GROUP_SELECTOR),
        students: getOptions($, STUDENT_SELECTOR),
        schedule,
    };
}
