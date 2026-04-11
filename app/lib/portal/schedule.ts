import * as cheerio from "cheerio";
import { TIME_TABLE_URL, getOptions } from ".";
import { type InitPortal } from "./init";
import parseSchedule, { type Schedule as Inner } from "./parse-schedule";

const GROUP_SELECTOR = "#timetableform-groupid";
const STUDENT_SELECTOR = "#timetableform-studentid";

const CACHE_KEY = (req: Req) => `${req.facultyId}:${req.course}:${req.groupId || "_"}:${req.studentId || "_"}`;
const CACHE_TTL_SECS = 60 * 60 * 24 * 7;

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

export default async function getSchedule(req: Req, kv: KVNamespace): Promise<Schedule> {
    const key = CACHE_KEY(req);

    const cache = await kv.get(key);
    if (cache) { return JSON.parse(cache); }

    const res = await fetch(TIME_TABLE_URL, createRequest(req));

    const html = await res.text();
    const $ = cheerio.load(html);

    const schedule = req.groupId && req.studentId ? parseSchedule(html) : undefined;

    const result = {
        groups: getOptions($, GROUP_SELECTOR),
        students: getOptions($, STUDENT_SELECTOR),
        schedule,
    };

    await kv.put(key, JSON.stringify(result), {
        expirationTtl: CACHE_TTL_SECS,
    });

    return result;
}
