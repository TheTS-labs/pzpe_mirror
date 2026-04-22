import type { Req } from ".";

export const BASE_KEY = "base";
export const REQ_KEY_ORDER: (keyof Req)[] = ["facultyId", "course", "groupId", "studentId"];
export const createReqKey = (req: Req) => REQ_KEY_ORDER.map(key => req[key] ?? "").join(":");
export const CACHE_TTL = 60 * 60 * 24 * 7;

export const FACULTY_SELECTOR = "#timetableform-facultyid";
export const META_CSRF_SELECTOR = "meta[name=\"csrf-token\"]";
export const INPUT_CSRF_SELECTOR = "input[name=\"_csrf-frontend\"]";

export const COURSE_SELECTOR = "#timetableform-course";
export const GROUP_SELECTOR = "#timetableform-groupid";
export const STUDENT_SELECTOR = "#timetableform-studentid";

export const EVENTS_REGEX = /var events = ({[\s\S]*?});/;
