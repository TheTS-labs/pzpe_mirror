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

export const loader = () => ({ init: initPortal() });

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const req = Object.fromEntries(formData) as Partial<Req>;

    if (!req.csrf_token || !req.meta_csrf_token || !req.cookies || !req.faculty_id || !req.course) {
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

        if (!formData.get("faculty_id") || !formData.get("course")) { 
            return; 
        }

        if (targetName === "faculty_id" || targetName === "course") {
            formData.delete("group_id");
            formData.delete("student_id");
        } else if (targetName === "group_id") {
            formData.delete("student_id");
        }

        fetcher.submit(formData, { method: "post" });
    }, [fetcher]);

    const isSubmitting = fetcher.state !== "idle";

    const isLoadingGroups = isSubmitting && !fetcher.formData?.has("group_id");
    const isLoadingStudents = isSubmitting && fetcher.formData?.has("group_id") && !fetcher.formData?.has("student_id");
    const isLoadingSchedule = isSubmitting && fetcher.formData?.has("group_id") && fetcher.formData?.has("student_id");

    console.log(fetcher.data?.schedule);

    return <main className="p-12 flex flex-col gap-10">
        <form className="flex flex-row gap-5 items-center justify-items-center" onChange={onFormChange}> 
            <HiddenInputs init={init} />
            <FacultySelector init={init} />
            <CourseSelector />
            
            <Selector
                name="group_id"
                data={fetcher.data?.groups}
                loading={isLoadingGroups}
                placeholder="--- Group ---"
            />
            <Selector
                name="student_id"
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
                    <ul className="list-disc list-inside">
                        {lessons.map(lesson => <li>
                            <b>{lesson.date.start} - {lesson.date.end}</b>: {lesson.subject.full} <span className="text-muted-foreground">{`[${lesson.subject.type}]`}</span>
                        </li>)}
                    </ul>
                </div>

                <Separator />
            </>)}
        </div>
    </main>;
}