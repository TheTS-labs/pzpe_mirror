export type ErrorCodes = "csrf_missing" | "origin_request_failed" | "schedule_parsing_failed";

export default class PortalError extends Error {
    constructor(public errCode: ErrorCodes) {
        super(errCode);
    }
};
