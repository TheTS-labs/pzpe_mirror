import type { Schedule } from "./parse-schedule";
import type { ErrorCodes } from "./portal-error";
import PortalError from "./portal-error";

export const BASE_URL = "https://portal.zp.edu.ua";
export const TIME_TABLE_URL = `${BASE_URL}/time-table/student?type=1`;

export interface Req {
    facultyId?: string,
    course?: string,
    groupId?: string
    studentId?: string
}

export interface Res {
    faculties: [number, string][],
    courses: [number, string][],
    groups: [number, string][],
    students: [number, string][],
    schedule: Schedule,

    cacheCreatedAt?: number,
}

export interface Csrf {
    metaCsrfToken: string,
    csrfToken: string,
    cookies: string,
}

export type Result<T> = {
    errCode?: ErrorCodes,
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
