import { useCallback, useState } from "react";
import { useFetcher, useLoaderData, type ActionFunctionArgs } from "react-router";
import CourseSelector from "~/components/index/CourseSelector";
import FacultySelector from "~/components/index/FacultySelector";
import type { Payload } from "~/lib/portal";
import getSchedule from "~/lib/portal/schedule";
import initPortal from "~/lib/portal/init";
import Selector from "~/components/index/Selector";
import { Spinner } from "~/components/ui/spinner";

const FIELD_PRIORITY: (keyof Fields)[] = ["faculty_id", "course", "group_id", "student_id"];
interface Fields {
    faculty_id?: string,
    course?: string,
    group_id?: string,
    student_id?: string,
}

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
    return getSchedule(req as any);
}

export default function Home() {
    const { init } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    const [form, setForm] = useState<Fields>({});

    const update = useCallback(async (fields: Fields) => {
        if (!fields.faculty_id || !fields.course) { return; }

        const resolved_init = await init;

        fetcher.submit({
            csrf_token: resolved_init.csrf_token,
            meta_csrf_token: resolved_init.meta_csrf_token,
            cookies: resolved_init.cookies,

            ...fields,
        }, { method: "post" });
    }, [init, fetcher]);

    const handleValueChange = useCallback((key: keyof Fields, value: string) => {
        let copy = { ...form, [key]: value };

        const index = FIELD_PRIORITY.findIndex(element => element == key);
        FIELD_PRIORITY.slice(index + 1, FIELD_PRIORITY.length).forEach(key => {
            delete copy[key];
        });

        setForm(copy);
        update(copy);
    }, [update, setForm, form]);

    const isLoadingSchedule = useCallback(
        () => fetcher.state !== "idle" && !!form?.group_id && !!form?.student_id,
        [fetcher, form]
    );

    return (
        <main className="p-12 flex flex-row gap-5 items-center justify-items-center"> 
            <FacultySelector init={init} onValueChange={val => handleValueChange("faculty_id", val)} value={form?.faculty_id} />
            <CourseSelector onValueChange={val => handleValueChange("course", val)} value={form?.course} />
            <Selector
                data={fetcher.data?.groups}
                loading={fetcher.state !== "idle" && !isLoadingSchedule()}
                onValueChange={val => handleValueChange("group_id", val)}
                value={form?.group_id}
                placeholder="--- Group ---"
            />
            <Selector
                data={fetcher.data?.students}
                loading={fetcher.state !== "idle" && !isLoadingSchedule()}
                onValueChange={val => handleValueChange("student_id", val)}
                value={form?.student_id}
                placeholder="--- Student ---"
            />

            {isLoadingSchedule() && <Spinner />}
        </main>
    );
}