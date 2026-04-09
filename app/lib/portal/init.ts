import * as cheerio from "cheerio";

const BASE_URL = "https://portal.zp.edu.ua/time-table/student";
const FACULTY_SELECTOR = "#timetableform-facultyid";

export interface InitPortal {
    csrf_token: string,
    meta_csrf_token: string,
    cookies: string,

    faculties: [number, string][],
}

function get_pairs($: cheerio.CheerioAPI, selector: string): [number, string][] {
    return $(selector).children("option").map((_, el) => {
        const element = $(el);

        const id = parseInt(element.attr("value") || "", 10);
        const name = element.text().trim();

        if (Number.isNaN(id)) { return null; }

        return [[ id, name ]]; 
    })
    .get()
    .filter(el => el !== null) as [number, string][]; 
}

export default async function initPortal(): Promise<InitPortal> {
    const res = await fetch(BASE_URL);
    const html = await res.text();

    const cookies = res.headers.get("set-cookie") || "";
    let $ = cheerio.load(html);

    const meta_csrf_token = $('meta[name="csrf-token"]').attr("content");
    const csrf_token = $('input[name="_csrf-frontend"]').val() as string | undefined;

    if (!meta_csrf_token || !csrf_token) {
        throw new Error("Could not init Portal: No meta CSRF token or input CSRF token");
    }

    return {
        csrf_token,
        meta_csrf_token,
        cookies,

        faculties: get_pairs($, FACULTY_SELECTOR),
    };
}