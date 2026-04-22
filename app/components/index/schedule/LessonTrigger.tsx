import { AccordionTrigger } from "~/components/ui/accordion";
import type { Lesson } from "~/lib/portal/parse-schedule.server";

import type { Dayjs } from "dayjs";

export default function LessonTrigger({ lesson, now }: { lesson: Lesson<Dayjs>, now: Dayjs }) {
    const textColor = now?.isBetween(
        lesson.time.start.subtract(10, "minutes"),
        lesson.time.end,
    ) ? "text-indigo-400" : "";
    
    return <AccordionTrigger className={textColor}>
        <div className="pr-4">
            <span className="whitespace-nowrap font-bold mr-5 tabular-nums">
                {`${lesson.time.start.format("HH:mm")} - ${lesson.time.end.format("HH:mm")}:`}
            </span>

            {`${lesson.subject.full} `}
    
            <span className="text-muted-foreground whitespace-nowrap">[{lesson.subject.type}]</span>
        </div>
    </AccordionTrigger>;
}
