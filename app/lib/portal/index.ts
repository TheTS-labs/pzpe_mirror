import * as cheerio from "cheerio";

export const BASE_URL = "https://portal.zp.edu.ua";
export const TIME_TABLE_URL = `${BASE_URL}/time-table/student?type=1`;

export function getOptions($: cheerio.CheerioAPI, selector: string): [number, string][] {
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
