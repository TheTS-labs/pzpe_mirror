import * as cheerio from "cheerio";
import { BASE_URL, create_request, get_options } from ".";
import { type InitPortal } from "./init";

const GROUP_SELECTOR = "#timetableform-groupid";
const STUDENT_SELECTOR = "#timetableform-studentid";

export type Req = { course: string, faculty_id: string } & Pick<InitPortal, "csrf_token" | "meta_csrf_token" | "cookies">;
export interface Schedule {
    groups: [number, string][],
    students: [number, string][],
};

export default async function getSchedule(req: Req): Promise<Schedule> {
    const res = await fetch(BASE_URL, create_request(req));

    const html = await res.text();
    const $ = cheerio.load(html);

    return {
        groups: get_options($, GROUP_SELECTOR),
        students: get_options($, STUDENT_SELECTOR),
    };
}