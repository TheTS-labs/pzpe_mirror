import * as cheerio from "cheerio";
import type { Req, Csrf } from ".";
import log from "../log.server";

export function getOptions($: cheerio.CheerioAPI, selector: string): [number, string][] {
    const pairs = $(selector).children("option").map((_, el) => {
        const element = $(el);

        const id = parseInt(element.attr("value") || "", 10);
        const name = element.text().trim();

        if (Number.isNaN(id)) { return null; }

        return [[ id, name ]]; 
    })
        .get()
        .filter(el => el !== null) as [number, string][];

    log("parsing", { selector, pairs: pairs.length });

    return pairs;
}

export function createCookieHeader(setCookie: string[]) {
    if (!setCookie || setCookie.length === 0) {
        return "";
    }

    return setCookie
        .map(cookie => cookie.split(";")[0].trim())
        .join("; ");
}

export function createRequestOptions(req: Req, csrf?: Csrf): RequestInit {
    if (!csrf || !req.facultyId) { 
        return {};
    }

    const body = new URLSearchParams();

    body.set("_csrf-frontend", csrf.csrfToken);
    body.set("TimeTableForm[facultyId]", req.facultyId);

    if (req.course) { body.set("TimeTableForm[course]", req.course); }
    if (req.groupId) { body.set("TimeTableForm[groupId]", req.groupId); }
    if (req.studentId) { body.set("TimeTableForm[studentId]", req.studentId); }

    return {
        method: "POST",
        body,
        headers: {
            "X-CSRF-Token": csrf.metaCsrfToken,
            "Cookie": csrf.cookies,
        },

        signal: AbortSignal.timeout(3000),
    };
}
