import * as cheerio from "cheerio";
import { BASE_URL, get_options } from ".";
import { type InitPortal } from "./init";
import parseSchedule, { type Schedule as Inner } from "./parse_schedule";

const GROUP_SELECTOR = "#timetableform-groupid";
const STUDENT_SELECTOR = "#timetableform-studentid";

export type Req = {
    course: string,
    faculty_id: string,
    group_id?: string
    student_id?: string
} & Pick<InitPortal, "csrf_token" | "meta_csrf_token" | "cookies">;

export interface Schedule {
    groups: [number, string][],
    students: [number, string][],
    
    // TODO: Change naming
    schedule: Inner | undefined
};

function create_request(req: Req): RequestInit {
    const body = new FormData();

    body.set("_csrf-frontend", req.csrf_token);
    body.set("TimeTableForm[facultyId]", req.faculty_id);
    body.set("TimeTableForm[course]", req.course);

    if (req.group_id) { body.set("TimeTableForm[groupId]", req.group_id); }
    if (req.student_id) { body.set("TimeTableForm[studentId]", req.student_id); }

    return {
        method: "POST",
        body,
        headers: {
            "X-CSRF-Token": req.meta_csrf_token,
            "Cookie": req.cookies,
        }
    };
}

export default async function getSchedule(req: Req): Promise<Schedule> {
    const res = await fetch(BASE_URL, create_request(req));

    const html = await res.text();
    const $ = cheerio.load(html);

    const schedule = req.group_id && req.student_id ? parseSchedule(html) : undefined;

    return {
        groups: get_options($, GROUP_SELECTOR),
        students: get_options($, STUDENT_SELECTOR),
        schedule,
    };
}