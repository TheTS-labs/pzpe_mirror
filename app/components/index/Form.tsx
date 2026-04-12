import { Spinner } from "../ui/spinner";
import CourseSelector from "./CourseSelector";
import FacultySelector from "./FacultySelector";
import Selector from "./Selector";
import { Await, useSearchParams, type FetcherWithComponents } from "react-router";
import { Suspense, useCallback } from "react";
import type { Faculties } from "~/lib/portal/get-init";
import type { CascadingResponse } from "~/lib/portal/get-cascading";

export interface FormProps {
    fetcher: FetcherWithComponents<CascadingResponse | null>,
    faculties: Promise<Faculties>,
    bootstrap: Promise<CascadingResponse> | undefined,
}

export default function Form(props: FormProps) {
    const [searchParams, setSearchParams] = useSearchParams();

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
            course: formData.get("course")!.toString(),
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

    const renderSelectors = (bootstrapData?: CascadingResponse) => {
        const activeData = props.fetcher.data || bootstrapData;

        return <>
            <Selector
                name="groupId"
                data={activeData?.groups}
                loading={isLoadingGroups}
                placeholder="--- Group ---"
                defaultValue={searchParams.get("groupId") || undefined}
            />
            <Selector
                name="studentId"
                data={activeData?.students}
                loading={isLoadingStudents}
                placeholder="--- Student ---"
                disabled={isLoadingGroups}
                defaultValue={searchParams.get("studentId") || undefined}
            />
        </>;
    };

    return (
        <form
            className="flex flex-col md:flex-row gap-5 items-center justify-items-center md:max-w-prose w-full"
            onChange={onFormChange}
        >
            <FacultySelector faculties={props.faculties} defaultValue={searchParams.get("facultyId") || undefined} />
            <CourseSelector defaultValue={searchParams.get("course") || undefined} />
                
            <Suspense fallback={renderSelectors()}>
                <Await resolve={props.bootstrap}>
                    {resolved => renderSelectors(resolved)}
                </Await>
            </Suspense>

            {isLoadingSchedule && <Spinner className="flex-none size-6" />}
        </form>
    );
}
