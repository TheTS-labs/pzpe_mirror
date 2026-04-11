import type { Lesson, Schedule } from "~/lib/portal/parse-schedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Separator } from "~/components/ui/separator";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export interface ScheduleProps {
    schedule: Schedule | undefined
}

export default function Schedule(props: ScheduleProps) {
    const schedule = props.schedule && Object.entries(props.schedule).map(([date, lessons]) => [
        dayjs(date, "DD.MM.YYYY"),
        lessons.map(lesson => ({
            ...lesson,
            time: {
                start: dayjs.tz(`${date} ${lesson.time.start}`, "DD.MM.YYYY HH:mm", "Europe/Kyiv"),
                end: dayjs.tz(`${date} ${lesson.time.end}`, "DD.MM.YYYY HH:mm", "Europe/Kyiv"),
            }
        }))
    ] as [Dayjs, Lesson<Dayjs>[]]);

    const [now, setNow] = useState(dayjs().tz("Europe/Kyiv"));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(dayjs().tz("Europe/Kyiv"));
        }, 60_000);

        return () => clearInterval(intervalId);
    }, []);

    return <div className="flex flex-col gap-5 w-full max-w-4xl md:max-w-2xl mx-auto px-4">
        {schedule && schedule.map(([date, lessons]) => <React.Fragment key={date.toString()}>
            <div>
                <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {date.format("DD.MM.YYYY")}{" "}
                    <span className="text-neutral-500 text-2xl">({date.format("ddd")}, {date.fromNow()})</span>
                </h1>

                <Accordion type="multiple">
                    {lessons.map((lesson, i) => <AccordionItem value={i.toString()} key={i}>
                        <AccordionTrigger
                            className={
                                now?.isBetween(
                                    lesson.time.start.subtract(10, "minutes"),
                                    lesson.time.end.add(10, "minutes"),
                                    null,
                                    "[]"
                                ) ? "text-blue-400" : ""
                            }
                        >
                            <div className="pr-4">
                                <b className="whitespace-nowrap">
                                    {lesson.time.start.format("HH:mm")}
                                    {" - "}
                                    {lesson.time.end.format("HH:mm")}
                                </b>
                                {`: ${lesson.subject.full} `}
                                <span className="text-muted-foreground whitespace-nowrap">
                                    [{lesson.subject.type}]
                                </span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="pl-4">
                            {lesson.notice.trim().split("\n").map((line, i) => <p key={i}>
                                {line.split(URL_REGEX).map((part, j) => 
                                    part.match(URL_REGEX)
                                        ? <a key={j} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
                                        : part
                                )}
                            </p>)}

                            <br />

                            <p className="text-neutral-500 italic">
                                Teacher: <span className="font-bold">{lesson.teacher}</span>
                                <br />
                                Classroom: <span className="font-bold">{lesson.classroom}</span>
                            </p>
                        </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
            </div>

            <Separator />
        </React.Fragment>)}
    </div>
}
