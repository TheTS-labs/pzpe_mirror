import { t, type Dictionary } from "intlayer";
import type { ErrorCodes } from "~/lib/portal/portal-error";

const content = {
    key: "errors",
    content: {
        csrf_missing: t({
            "en-US": "Request to the origin failed",
            "uk-UA": "Невдалий запит до джерела",
        }),
        origin_request_failed: t({
            "en-US": "Request to the origin failed",
            "uk-UA": "Невдалий запит до джерела",
        }),
        schedule_parsing_failed: t({
            "en-US": "Could not show schedule",
            "uk-UA": "Не вдається отримати розклад",
        }),
    } satisfies Record<ErrorCodes, unknown>
} satisfies Dictionary;

export default content;
