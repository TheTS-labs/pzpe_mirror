import { t, type Dictionary } from "intlayer";

const content = {
    key: "schedule",
    content: {
        teacher: t({
            "en-US": "Teacher:",
            "uk-UA": "Викладачі:",
        }),

        classroom: t({
            "en-US": "Classroom:",
            "uk-UA": "Аудиторія:",
        }),

        today: t({
            "en-US": "today",
            "uk-UA": "сьогодні",
        }),

        tomorrow: t({
            "en-US": "tomorrow",
            "uk-UA": "завтра",
        }),

        titleDateFormat: t({
            "en-US": "ddd",
            "uk-UA": "dd",
        }),
    },
} satisfies Dictionary;

export default content;
