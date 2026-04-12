import type { Lesson, Schedule } from "~/lib/portal/parse-schedule";
import { Accordion, AccordionContent, AccordionItem } from "../../ui/accordion";
import { Separator } from "~/components/ui/separator";
import React, { useEffect, useMemo, useState } from "react";
import Notice from "./Notice";
import LessonTrigger from "./LessonTrigger";
import Title from "./Title";

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

const TZ = "Europe/Kyiv";

export interface ScheduleProps {
    schedule: Schedule | undefined
}

export default function Schedule(props: ScheduleProps) {
    const [now, setNow] = useState(dayjs().tz(TZ));
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(dayjs().tz(TZ));
        }, 60_000);
    
        return () => clearInterval(intervalId);
    }, []);

    const today = dayjs().startOf("day");
    const schedule = useMemo(() => props.schedule && Object.entries(props.schedule).flatMap(([date, lessons]) => {
        const day = dayjs(date, "DD.MM.YYYY");

        if (day.isBefore(today, "day")) {
            return [];
        }

        return [[
            day,
            lessons.map(lesson => ({
                ...lesson,
                time: {
                    start: dayjs.tz(`${date} ${lesson.time.start}`, "DD.MM.YYYY HH:mm", "Europe/Kyiv"),
                    end: dayjs.tz(`${date} ${lesson.time.end}`, "DD.MM.YYYY HH:mm", "Europe/Kyiv"),
                }
            }))
        ]] as [Dayjs, Lesson<Dayjs>[]][];
    }), [props.schedule, today]);

    return <div className="flex flex-col gap-5 w-full max-w-4xl md:max-w-2xl mx-auto">
        {schedule && schedule.map(([date, lessons]) => <React.Fragment key={date.toString()}>
            <div>
                <Title date={date} />

                <Accordion type="multiple">
                    {lessons.map((lesson, i) => <AccordionItem value={i.toString()} key={i}>
                        <LessonTrigger lesson={lesson} now={now} />

                        <AccordionContent className="pl-4 break-words">
                            <Notice text={lesson.notice} />

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
