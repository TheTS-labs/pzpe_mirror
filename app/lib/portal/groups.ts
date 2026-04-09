import * as cheerio from "cheerio";
import { BASE_URL, create_request, get_options } from ".";
import { type InitPortal } from "./init";

const GROUP_SELECTOR = "#timetableform-groupid";

export type Req = { course: string, faculty_id: string } & Pick<InitPortal, "csrf_token" | "meta_csrf_token" | "cookies">;
export type Groups = [number, string][];

export default async function getGroups(req: Req): Promise<Groups> {
    const res = await fetch(BASE_URL, create_request(req));

    const html = await res.text();
    const $ = cheerio.load(html);

    return get_options($, GROUP_SELECTOR);
}