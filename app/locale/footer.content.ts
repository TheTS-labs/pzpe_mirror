import { t, type Dictionary } from "intlayer";

const content = {
    key: "footer",
    content: {
        item_zero: t({
            "en-US": "What does \"PZPE\" stand for?",
            "uk-UA": "Що означає \"PZPE\"?",
        }),

        item_one: {
            q: t({
                "en-US": "What do the \"PZPE\" colors mean?",
                "uk-UA": "Що означають кольори \"PZPE\"?",
            }),
            green: t({
                "en-US": "is online and operational",
                "uk-UA": "онлайн та працює",
            }),
            red: t({
                "en-US": "The portal is offline or unresponsive",
                "uk-UA": "Портал офлайн або не відповідає",
            }),
            gray: t({
                "en-US": "Checking connection status...",
                "uk-UA": "Перевірка стану...",
            }),
        },

        item_two: {
            q: t({
                "en-US": "Is this project open source?",
                "uk-UA": "Чи цей проєкт з відкритим кодом?",
            }),
            a: [
                t({
                    "en-US": "Yes! The source code is available on",
                    "uk-UA": "Так! Код доступний на",
                }),
                t({
                    "en-US": "Feel free to drop a star, report bugs, or propose changes.",
                    "uk-UA": "Не соромтеся ставити зірочку, повідомляти про помилки або пропонувати зміни.",
                }),
            ],
        },

        item_three: {
            q: t({
                "en-US": "What was your motivation for this project?",
                "uk-UA": "Яка була ваша мотивація для цього проєкту?",
            }),
            a: [
                t({
                    "en-US": "My reasons for doing things:",
                    "uk-UA": "Мої причини для того, щоб робити що небуть:",
                }),
                t({
                    "en-US": "Spite",
                    "uk-UA": "Злоба",
                }),
                t({
                    "en-US": "The Aesthetic",
                    "uk-UA": "Естетика",
                }),
                t({
                    "en-US": "...okay I lied.",
                    "uk-UA": "...добре, я збрехав.",
                }),
                t({
                    "en-US": "Attention",
                    "uk-UA": "Увага",
                }),
            ],
        },

        item_four: {
            q: t({
                "en-US": "omg ur so goated its actually insane. Do you accept donations by any chance?",
                "uk-UA": "Ви приймаєте донати?",
            }),
            a: t({
                "en-US": "Of course!! Donations are always welcome:",
                "uk-UA": "Звичайно!! Донати завжди вітаються:",
            }),
        },
    }
} satisfies Dictionary;

export default content;
