import { useFetcher, useLoaderData, type ActionFunctionArgs } from "react-router";
import CourseSelector from "~/components/index/CourseSelector";
import FacultySelector from "~/components/index/FacultySelector";
import getSchedule, { type Req } from "~/lib/portal/schedule";
import initPortal from "~/lib/portal/init";
import Selector from "~/components/index/Selector";
import { Spinner } from "~/components/ui/spinner";
import HiddenInputs from "~/components/index/HiddenInputs";
import { useCallback } from "react";
import { Separator } from "~/components/ui/separator";
import Header from "~/components/index/Header";
import Footer from "~/components/index/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";

export const loader = () => ({ init: initPortal() });

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const req = Object.fromEntries(formData) as Partial<Req>;

    if (!req.csrfToken || !req.metaCsrfToken || !req.cookies || !req.facultyId || !req.course) {
        return null;
    }

    return getSchedule(req as Req);
}

export default function Home() {
    const { init } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    const onFormChange = useCallback<React.ChangeEventHandler<HTMLFormElement>>((e) => {
        const form = e.currentTarget;
        const targetName = e.target.name;
        const formData = new FormData(form);

        if (!formData.get("facultyId") || !formData.get("course")) { 
            return; 
        }

        if (targetName === "facultyId" || targetName === "course") {
            formData.delete("groupId");
            formData.delete("studentId");
        } else if (targetName === "groupId") {
            formData.delete("studentId");
        }

        fetcher.submit(formData, { method: "post" });
    }, [fetcher]);

    const isSubmitting = fetcher.state !== "idle";

    const isLoadingGroups = isSubmitting && !fetcher.formData?.has("groupId");
    const isLoadingStudents = isSubmitting && fetcher.formData?.has("groupId") && !fetcher.formData?.has("studentId");
    const isLoadingSchedule = isSubmitting && fetcher.formData?.has("groupId") && fetcher.formData?.has("studentId");

    return <main className="p-12 flex flex-col items-center gap-10">
        <Header />

        <form className="flex flex-row gap-5 items-center justify-items-center max-w-prose w-full" onChange={onFormChange}> 
            <HiddenInputs init={init} />
            <FacultySelector init={init} />
            <CourseSelector />
            
            <Selector
                name="groupId"
                data={fetcher.data?.groups}
                loading={isLoadingGroups}
                placeholder="--- Group ---"
            />
            <Selector
                name="studentId"
                data={fetcher.data?.students}
                loading={isLoadingStudents}
                placeholder="--- Student ---"
                disabled={isLoadingGroups}
            />

            {isLoadingSchedule && <Spinner />}
        </form>

        <div className="flex flex-col gap-5">
            {fetcher.data?.schedule && Object.entries(fetcher.data?.schedule).map(([date, lessons]) => <>
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

        {!fetcher.data?.schedule && <Footer />}
    </main>;
}
