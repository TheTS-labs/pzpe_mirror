import * as cheerio from "cheerio";

export const BASE_URL = "https://portal.zp.edu.ua/time-table/student";

export function get_options($: cheerio.CheerioAPI, selector: string): [number, string][] {
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

export interface Payload {
    cookies: string,
    meta_csrf_token: string,
    csrf_token: string,
    faculty_id: string,
    course?: string | undefined,
    group_id?: string | undefined,
    student_id?: string | undefined,
}

export function create_request(payload: Payload): RequestInit {
    const body = new FormData();

    body.set("_csrf-frontend", payload.csrf_token);
    body.set("TimeTableForm[facultyId]", payload.faculty_id);

    if (payload.course) { body.set("TimeTableForm[course]", payload.course); }
    if (payload.group_id) { body.set("TimeTableForm[groupId]", payload.group_id); }
    if (payload.student_id) { body.set("TimeTableForm[studentId]", payload.student_id); }

    return {
        method: "POST",
        body,
        headers: {
            "X-CSRF-Token": payload.meta_csrf_token,
            "Cookie": payload.cookies,
        }
    };
}
