import type { Schedule } from "~/lib/portal/parse-schedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Separator } from "~/components/ui/separator";

export interface ScheduleProps {
    schedule: Schedule | undefined
}

export default function Schedule(props: ScheduleProps) {
    return <div className="flex flex-col gap-5">
        {props.schedule && Object.entries(props.schedule).map(([date, lessons]) => <>
            <div>
                <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{date}</h1>

                <Accordion type="multiple">
                    {lessons.map(lesson => <AccordionItem value={lesson.time.start}>
                        <AccordionTrigger>
                            <b>{lesson.time.start} - {lesson.time.end}</b>: {lesson.subject.full} <span className="text-muted-foreground">[{lesson.subject.type}]</span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                            {lesson.notice.split("\n").map((line) => <p>{line}</p>)}
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
        </>)}
    </div>
}
