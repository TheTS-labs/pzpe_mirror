import * as cheerio from "cheerio";
import { BASE_URL, get_options } from ".";

const FACULTY_SELECTOR = "#timetableform-facultyid";
const META_CSRF_SELECTOR = 'meta[name="csrf-token"]';
const INPUT_CSRF_SELECTOR = 'input[name="_csrf-frontend"]';

function createCookieHeader(set_cookie: string[]) {
    if (!set_cookie || set_cookie.length === 0) {
        return "";
    }

    return set_cookie
        .map(cookie => cookie.split(';')[0].trim())
        .join('; ');
}

export interface InitPortal {
    csrf_token: string,
    meta_csrf_token: string,
    cookies: string,

    faculties: [number, string][],
}

export default async function initPortal(): Promise<InitPortal> {
    const res = await fetch(BASE_URL);
    const html = await res.text();

    const cookies = createCookieHeader(res.headers.getSetCookie());
    const $ = cheerio.load(html);

    const meta_csrf_token = $(META_CSRF_SELECTOR).attr("content");
    const csrf_token = $(INPUT_CSRF_SELECTOR).val() as string | undefined;

    if (!meta_csrf_token || !csrf_token) {
        throw new Error("Could not init Portal: No meta CSRF token or input CSRF token");
    }

    return {
        csrf_token,
        meta_csrf_token,
        cookies,

        faculties: get_options($, FACULTY_SELECTOR),
    };
}