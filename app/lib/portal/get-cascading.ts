import * as cheerio from "cheerio";
import { TIME_TABLE_URL, getOptions } from ".";
import getInit, { type Csrf } from "./get-init";
import parseSchedule, { type Schedule } from "./parse-schedule";
import { getCache, setCache } from "../cache";

const GROUP_SELECTOR = "#timetableform-groupid";
const STUDENT_SELECTOR = "#timetableform-studentid";

export interface CascadingRequest {
    course: string,
    facultyId: string,
    groupId?: string
    studentId?: string
}

export interface CascadingResponse {
    groups: [number, string][],
    students?: [number, string][],
    schedule?: Schedule,
}

const CACHE_KEY = (req: CascadingRequest) => `${req.facultyId}:${req.course}:${req.groupId || "_"}:${req.studentId || "_"}`;
const CACHE_TTL = 60 * 60 * 24 * 7;

export default async function getCascading(req: CascadingRequest, kv: KVNamespace, ctx: ExecutionContext) {
    const now = Date.now();
    const key = CACHE_KEY(req);
    const cache = await getCache<CascadingResponse>(key, kv);
    if (cache) {
        if (cache.metadata.staleAt && now > cache.metadata.staleAt) {
            ctx.waitUntil((async () => {
                const csrf = await getInit(kv, ctx, "csrf");
                const res = await hitOrigin(req, csrf);

                await setCache(key, res, kv, { expirationTtl: CACHE_TTL });
            })());
        }

        return cache.value;
    }

    const csrf = await getInit(kv, ctx, "csrf");
    const value = await hitOrigin(req, csrf);

    ctx.waitUntil(setCache(key, value, kv, { expirationTtl: CACHE_TTL }));

    return value;
}

async function hitOrigin(req: CascadingRequest, csrf: Csrf): Promise<CascadingResponse> {
    const html = await fetch(TIME_TABLE_URL, createRequestOptions(req, csrf)).then(res => res.text());
    const $ = cheerio.load(html);

    return {
        groups: getOptions($, GROUP_SELECTOR),
        students: req.groupId ? getOptions($, STUDENT_SELECTOR) : undefined,
        schedule: (req.groupId && req.studentId) ? parseSchedule(html) : undefined,
    }
}

function createRequestOptions(req: CascadingRequest, csrf: Csrf): RequestInit {
    const body = new URLSearchParams();

    body.set("_csrf-frontend", csrf.csrfToken);
    body.set("TimeTableForm[facultyId]", req.facultyId);
    body.set("TimeTableForm[course]", req.course);

    if (req.groupId) { body.set("TimeTableForm[groupId]", req.groupId); }
    if (req.studentId) { body.set("TimeTableForm[studentId]", req.studentId); }

    return {
        method: "POST",
        body,
        headers: {
            "X-CSRF-Token": csrf.metaCsrfToken,
            "Cookie": csrf.cookies,
        },
    };
}
