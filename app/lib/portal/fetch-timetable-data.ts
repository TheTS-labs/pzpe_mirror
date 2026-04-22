import * as cheerio from "cheerio";
import { TIME_TABLE_URL, type Csrf, type Req, type Res } from ".";
import { manageCache } from "../cache-manager";
import PortalError from "./portal-error";
import parseSchedule from "./parse-schedule";
import { createRequestOptions, getOptions, createCookieHeader } from "./utils";
import { BASE_KEY, CACHE_TTL, createReqKey, COURSE_SELECTOR, GROUP_SELECTOR, STUDENT_SELECTOR, META_CSRF_SELECTOR, INPUT_CSRF_SELECTOR, FACULTY_SELECTOR } from "./constants";

export default async function fetchTimetableData(req: Req): Promise<Res> {
    const { value: { faculties, ...csrf } } = await manageCache(BASE_KEY, CACHE_TTL, revalidateBase);

    if (!req.facultyId) {
        return {
            faculties,
            courses: [],
            groups: [],
            students: [],
            schedule: {},
        };
    }

    return manageCache(createReqKey(req), CACHE_TTL, () => revalidate(req, csrf))
        .then(({ value, metadata }) => ({ faculties, ...value, cacheCreatedAt: metadata?.createdAt }));
}

async function revalidate(req: Req, csrf: Csrf): Promise<Omit<Res, "faculties">> {
    const html = await fetch(TIME_TABLE_URL, createRequestOptions(req, csrf))
        .then(res => res.text())
        .catch(() => { throw new PortalError("origin_request_failed"); });

    const $ = cheerio.load(html);

    return {
        courses: getOptions($, COURSE_SELECTOR),
        groups: req.course ? getOptions($, GROUP_SELECTOR) : [],
        students: (req.course && req.groupId) ? getOptions($, STUDENT_SELECTOR) : [],
        schedule: (req.course && req.groupId && req.studentId) ? parseSchedule(html) : {},
    }
}

async function revalidateBase(): Promise<Pick<Res, "faculties"> & Csrf> {
    const { html, cookies } = await fetch(TIME_TABLE_URL, createRequestOptions({})).then(async res => ({
        html: await res.text(),
        cookies: createCookieHeader(res.headers.getSetCookie()),
    })).catch(() => { throw new PortalError("origin_request_failed"); });

    const $ = cheerio.load(html);

    const metaCsrfToken = $(META_CSRF_SELECTOR).attr("content");
    const csrfToken = $(INPUT_CSRF_SELECTOR).val() as string | undefined;

    if (!metaCsrfToken || !csrfToken) {
        throw new PortalError("csrf_missing");
    }

    const faculties = getOptions($, FACULTY_SELECTOR);

    return { cookies, metaCsrfToken, csrfToken, faculties };
}
