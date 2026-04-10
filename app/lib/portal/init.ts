import * as cheerio from "cheerio";
import { BASE_URL, getOptions } from ".";

const FACULTY_SELECTOR = "#timetableform-facultyid";
const META_CSRF_SELECTOR = "meta[name=\"csrf-token\"]";
const INPUT_CSRF_SELECTOR = "input[name=\"_csrf-frontend\"]";

function createCookieHeader(setCookie: string[]) {
    if (!setCookie || setCookie.length === 0) {
        return "";
    }

    return setCookie
        .map(cookie => cookie.split(";")[0].trim())
        .join("; ");
}

export interface InitPortal {
    csrfToken: string,
    metaCsrfToken: string,
    cookies: string,

    faculties: [number, string][],
}

export default async function initPortal(): Promise<InitPortal> {
    const res = await fetch(BASE_URL);
    const html = await res.text();

    const cookies = createCookieHeader(res.headers.getSetCookie());
    const $ = cheerio.load(html);

    const metaCsrfToken = $(META_CSRF_SELECTOR).attr("content");
    const csrfToken = $(INPUT_CSRF_SELECTOR).val() as string | undefined;

    if (!metaCsrfToken || !csrfToken) {
        throw new Error("Could not init Portal: No meta CSRF token or input CSRF token");
    }

    return {
        csrfToken,
        metaCsrfToken,
        cookies,

        faculties: getOptions($, FACULTY_SELECTOR),
    };
}
