import type { Schedule } from "~/lib/portal/parse-schedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Separator } from "~/components/ui/separator";
import React from "react";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export interface ScheduleProps {
    schedule: Schedule | undefined
}

export default function Schedule(props: ScheduleProps) {
    return <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto px-4">
        {props.schedule && Object.entries(props.schedule).map(([date, lessons]) => <React.Fragment key={date}>
            <div>
                <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{date}</h1>

                <Accordion type="multiple">
                    {lessons.map(lesson => <AccordionItem value={lesson.time.start} key={lesson.time.start}>
                        <AccordionTrigger className="text-left">
                            <div className="pr-4">
                                <b className="whitespace-nowrap">{lesson.time.start} - {lesson.time.end}</b>
                                : {lesson.subject.full}{" "}
                                <span className="text-muted-foreground whitespace-nowrap">
                                    [{lesson.subject.type}]
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                            {lesson.notice.trim().split("\n").map((line, i) => <p key={i}>
                                {line.split(URL_REGEX).map((part, j) => part.match(URL_REGEX) ? <a 
                                    key={j} 
                                    href={part} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {part}
                                </a> : part)}
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
