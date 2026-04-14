import { t, type Dictionary } from "intlayer";

const content = {
    key: "form",
    content: {
        placeholders: {
            group: t({
                "en-US": "--- Group ---",
                "uk-UA": "--- Група ---",
            }),

            faculty: t({
                "en-US": "--- Faculty ---",
                "uk-UA": "--- Факультет ---",
            }),

            course: t({
                "en-US": "--- Course ---",
                "uk-UA": "--- Курс ---",
            }),

            student: t({
                "en-US": "--- Student ---",
                "uk-UA": "--- Студент ---",
            }),
        },

        facultiesRejected: t({
            "en-US": "Failed to load faculties",
            "uk-UA": "Не вдалося завантажити факультети",
        }),
    },
} satisfies Dictionary;

export default content;
