import type { Dayjs } from "dayjs";

export default function Title({ date }: { date: Dayjs }) {
    return <h1 className="scroll-m-20 pb-2 text-3xl tracking-tight font-semibold first:mt-0 flex flex-col md:items-end md:flex-row md:gap-2">
        <span>{date.format("DD.MM.YYYY")}</span>
        <span className="text-neutral-500 text-2xl">({date.format("ddd")}, {date.fromNow()})</span>
    </h1>
}
