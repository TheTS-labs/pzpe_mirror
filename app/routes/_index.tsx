import { useCallback, useState } from "react";
import { useFetcher, useLoaderData, type ActionFunctionArgs } from "react-router";
import CourseSelector from "~/components/index/CourseSelector";
import FacultySelector from "~/components/index/FacultySelector";
import type { Payload } from "~/lib/portal";
import getGroups from "~/lib/portal/groups";
import initPortal from "~/lib/portal/init";
import GroupSelector from "~/components/index/GroupSelector";

export async function loader() {
    return {
        init: initPortal()
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const req = Object.fromEntries(formData) as Partial<Payload>;

    if (!req.csrf_token || !req.meta_csrf_token || !req.cookies || !req.faculty_id || !req.course) {
        return undefined;
    }

    // TODO: Remove `as any`
    return getGroups(req as any);
}

export default function Home() {
    const { init } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();
    
    const [faculty_id, setFacultyId] = useState<string | undefined>();
    const [course, setCourse] = useState<string | undefined>();
    const [group_id, setGroupId] = useState<string | undefined>();
    const [student_id, setStudentId] = useState<string | undefined>();

    const update = useCallback(async (overrides?: { faculty_id?: string, course?: string }) => {
        const currentFacultyId = overrides?.faculty_id ?? faculty_id;
        const currentCourse = overrides?.course ?? course;

        if (!currentFacultyId || !currentCourse) { return; }

        const resolved_init = await init;

        fetcher.submit(
            {
                csrf_token: resolved_init.csrf_token,
                meta_csrf_token: resolved_init.meta_csrf_token,
                cookies: resolved_init.cookies,

                faculty_id: currentFacultyId,
                course: currentCourse,
                ...(group_id && { group_id }),
                ...(student_id && { student_id }),
            },
            { method: "post" }
        );
    }, [init, faculty_id, course, group_id, student_id, fetcher]);

    const onValueChange = useCallback((set: (value: string) => void, key: keyof Payload) => {
        return (value: string) => {
            (async () => {
                set(value);
                await update({ [key]: value });
            })();
        };
    }, []);

    return (
        <main className="p-12 flex flex-row gap-5"> 
            <FacultySelector init={init} onValueChange={onValueChange(setFacultyId, "faculty_id")} value={faculty_id} />
            <CourseSelector onValueChange={onValueChange(setCourse, "course")} value={course} />
            <GroupSelector groups={fetcher.data} loading={fetcher.state == "loading"} onValueChange={onValueChange(setGroupId, "group_id")} value={group_id} />
        </main>
    );
}