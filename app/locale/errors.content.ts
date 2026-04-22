import { t, type Dictionary } from "intlayer";
import type { ErrorCodes } from "~/lib/portal/portal-error.server";

const content = {
    key: "errors",
    content: {
        errors: {
            csrf_missing: t({
                "en-US": "Request to the origin failed. Why? I genuinely do not know..",
                "uk-UA": "Невдалий запит до джерела. Чому? Я не впевнений що я знаю..",
            }),
            origin_request_failed: t({
                "en-US": "Request to the origin failed. That could happen if there's no cached data and the origin's down in which case all you can do is try again later when the origin is back up again",
                "uk-UA": "Невдалий запит до джерела. Так може статися, якщо немає кешованих даних, а портал не працює, і в цьому випадку все, що ви можете зробити, це спробувати ще раз пізніше, коли портал знову запрацює",
            }),
            schedule_parsing_failed: t({
                "en-US": "Could not show schedule. Most probably you tried to request a student that doesn't have schedule (namely a part-time student)",
                "uk-UA": "Не вдається отримати розклад. Скоріш за все ви намагаєтесь запросити студента, який не має розкладу (наприклад студент заочної форми освіти)",
            }),
        } satisfies Record<ErrorCodes, unknown>,

        actions: {
            retry: t({
                "en-US": "Try again",
                "uk-UA": "Спробувати ще раз",
            }),

            clear: t({
                "en-US": "Clear form",
                "uk-UA": "Очистити форму",
            }),
        },

        title: t({
            "en-US": "Unable to load data",
            "uk-UA": "Не вдалося завантажити дані",
        }),
    }
} satisfies Dictionary;

export default content;
