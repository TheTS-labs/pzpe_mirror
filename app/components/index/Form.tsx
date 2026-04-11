import { type InitPortal } from "~/lib/portal/init";
import { Spinner } from "../ui/spinner";
import CourseSelector from "./CourseSelector";
import FacultySelector from "./FacultySelector";
import HiddenInputs from "./HiddenInputs";
import Selector from "./Selector";
import { useSearchParams, type FetcherWithComponents } from "react-router";
import type { Schedule } from "~/lib/portal/schedule";
import { useCallback, useEffect, useRef } from "react";

export interface FormProps {
    fetcher: FetcherWithComponents<Schedule | null>,
    init: Promise<InitPortal>,
}

export default function Form(props: FormProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const hasAutoSubmitted = useRef(searchParams.size === 0);

    useEffect(() => {
        if (hasAutoSubmitted.current) { return; }
        if (!searchParams.get("facultyId") || !searchParams.get("course")) {
            return;
        }

        props.init.then(({ faculties: _, ...csrf }) => {
            const search = Object.fromEntries(searchParams);
            
            hasAutoSubmitted.current = true;
            props.fetcher.submit({ ...search, ...csrf }, { method: "post" });
        })
    }, [props.fetcher, props.init, searchParams]);

    const onFormChange = useCallback<React.ChangeEventHandler<HTMLFormElement>>((e) => {
        const targetName = e.target.name;
        const formData = new FormData(e.currentTarget!);
    
        if (!formData.get("facultyId") || !formData.get("course")) { 
            return; 
        }
    
        if (targetName === "facultyId" || targetName === "course") {
            formData.delete("groupId");
            formData.delete("studentId");
        } else if (targetName === "groupId") {
            formData.delete("studentId");
        }

        setSearchParams({
            facultyId: formData.get("facultyId")!.toString(),
            course: formData.get("course")!.toString()!,
            ...(formData.get("groupId") ? { groupId: formData.get("groupId")?.toString() } : {}),
            ...(formData.get("studentId") ? { studentId: formData.get("studentId")?.toString() } : {}),
        }, { replace: true });
    
        props.fetcher.submit(formData, { method: "post" });
    }, [props.fetcher, setSearchParams]);

    const formData = props.fetcher.formData;
    const isSubmitting = props.fetcher.state !== "idle";

    const isLoadingGroups = isSubmitting && !formData?.has("groupId");
    const isLoadingStudents = isSubmitting && formData?.has("groupId") && !formData?.has("studentId");
    const isLoadingSchedule = isSubmitting && formData?.has("groupId") && formData?.has("studentId");

    return <form
        className="flex flex-row gap-5 items-center justify-items-center max-w-prose w-full"
        onChange={onFormChange}
    >
        <HiddenInputs init={props.init} />
        <FacultySelector init={props.init} defaultValue={searchParams.get("facultyId") || undefined} />
        <CourseSelector defaultValue={searchParams.get("course") || undefined} />
            
        <Selector
            name="groupId"
            data={props.fetcher.data?.groups}
            loading={isLoadingGroups}
            placeholder="--- Group ---"
            defaultValue={searchParams.get("groupId") || undefined}
        />
        <Selector
            name="studentId"
            data={props.fetcher.data?.students}
            loading={isLoadingStudents}
            placeholder="--- Student ---"
            disabled={isLoadingGroups}
            defaultValue={searchParams.get("studentId") || undefined}
        />

        {isLoadingSchedule && <Spinner className="flex-none size-6" />}
    </form>;
}
