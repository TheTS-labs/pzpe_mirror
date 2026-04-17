import * as cheerio from "cheerio";
import type { ErrorCodes } from "./portal-error";
import PortalError from "./portal-error";

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

export type Result<T> = {
    errCode?: undefined,
    result: T,
} | {
    errCode: ErrorCodes,
    result?: undefined,
};

export async function errorBoundary<Ret>(
    fn: () => Promise<Ret>,
): Promise<Result<Ret>> {
    return fn()
        .then(result => ({ result }))
        .catch((err: unknown) => {
            if (err instanceof PortalError) {
                return { errCode: err.errCode }; 
            }

            throw err; 
        });
}
