import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useIntlayer } from "react-intlayer";

export default function Title({ date }: { date: Dayjs }) {
    const { today: todayInlt, tomorrow, titleDateFormat } = useIntlayer("schedule");

    const today = dayjs().startOf("day");
    const diffDays = date.startOf("day").diff(today, "day");

    let relativeText = date.add(1, "day").fromNow();
    if (diffDays === 0) relativeText = todayInlt;
    if (diffDays === 1) relativeText = tomorrow;

    return (
        <h1 className="scroll-m-20 pb-2 text-3xl tracking-tight font-semibold first:mt-0 flex flex-col md:items-end md:flex-row md:gap-2">
            <span>{date.format("DD.MM.YYYY")}</span>
            <span className="text-neutral-500 text-2xl">
                ({date.format(titleDateFormat.value)}, {relativeText})
            </span>
        </h1>
    );
}
