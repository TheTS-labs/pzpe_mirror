import * as cheerio from "cheerio";
import { TIME_TABLE_URL, getOptions } from ".";
import { getCache, setCache } from "../cache";

export type Faculties = [number, string][];
export interface Csrf {
    metaCsrfToken: string,
    csrfToken: string,
    cookies: string,
}

const FACULTY_SELECTOR = "#timetableform-facultyid";
const META_CSRF_SELECTOR = "meta[name=\"csrf-token\"]";
const INPUT_CSRF_SELECTOR = "input[name=\"_csrf-frontend\"]";

const FACULTIES_CACHE_KEY = "faculties";
const CSRF_CACHE_KEY = "csrf";
const CACHE_TTL = 60 * 60 * 24 * 7;

export default async function getInit(kv: KVNamespace, ctx: ExecutionContext, requestFor?: "faculties"): Promise<Faculties>;
export default async function getInit(kv: KVNamespace, ctx: ExecutionContext, requestFor: "csrf"): Promise<Csrf>;
export default async function getInit(kv: KVNamespace, ctx: ExecutionContext, requestFor: "faculties" | "csrf" = "faculties"): Promise<Csrf | Faculties> {
    const now = Date.now();
    const key = requestFor == "faculties" ? FACULTIES_CACHE_KEY : CSRF_CACHE_KEY;

    const cache = await getCache<Csrf | Faculties>(key, kv);
    if (cache) {
        if (cache.metadata.staleAt && now > cache.metadata.staleAt) {
            ctx.waitUntil((async () => {
                const { faculties, ...csrf } = await hitOrigin();

                await setCache(FACULTIES_CACHE_KEY, faculties, kv, { expirationTtl: CACHE_TTL });
                await setCache(CSRF_CACHE_KEY, csrf, kv, { expirationTtl: CACHE_TTL });
            })());
        }
    
        return cache.value;
    }

    const { faculties, ...csrf } = await hitOrigin();

    ctx.waitUntil(setCache(FACULTIES_CACHE_KEY, faculties, kv, { expirationTtl: CACHE_TTL }));
    ctx.waitUntil(setCache(CSRF_CACHE_KEY, csrf, kv, { expirationTtl: CACHE_TTL }));

    return requestFor == "faculties" ? faculties : csrf;
}

async function hitOrigin(): Promise<{ faculties: Faculties } & Csrf> {
    const { html, cookies } = await fetch(TIME_TABLE_URL).then(async res => ({
        html: await res.text(),
        cookies: createCookieHeader(res.headers.getSetCookie()),
    }));

    const $ = cheerio.load(html);

    const metaCsrfToken = $(META_CSRF_SELECTOR).attr("content");
    const csrfToken = $(INPUT_CSRF_SELECTOR).val() as string | undefined;

    if (!metaCsrfToken || !csrfToken) {
        throw new Error("Could not init Portal: No meta CSRF token or input CSRF token");
    }

    const faculties = getOptions($, FACULTY_SELECTOR);

    return { cookies, metaCsrfToken, csrfToken, faculties };
}

function createCookieHeader(setCookie: string[]) {
    if (!setCookie || setCookie.length === 0) {
        return "";
    }

    return setCookie
        .map(cookie => cookie.split(";")[0].trim())
        .join("; ");
}
