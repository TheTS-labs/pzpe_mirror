import type { Res, Result } from "~/lib/portal";
import Selector from "./Selector";
import { useIntlayer } from "react-intlayer";
import { useNavigation, useSearchParams } from "react-router";
import { useCallback } from "react";
import { Spinner } from "~/components/ui/spinner";

export interface FormProps {
    data: Promise<Result<Res>>,
}

export default function Form({ data }: FormProps) {
    const { placeholders } = useIntlayer("form");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigation = useNavigation();

    const isSubmitting = navigation.state !== "idle";

    const onFormChange = useCallback<React.ChangeEventHandler<HTMLFormElement>>(e => {
        const targetName = e.target.name;
        const formData = new FormData(e.currentTarget);

        if (targetName === "facultyId") {
            formData.delete("course");
            formData.delete("groupId");
            formData.delete("studentId");
        } else if (targetName === "course") {
            formData.delete("groupId");
            formData.delete("studentId");
        } else if (targetName === "groupId") {
            formData.delete("studentId");
        }

        setSearchParams(Object.fromEntries(formData) as Record<string, string>, { replace: true });
    }, [setSearchParams]);

    return <form
        className="flex flex-col md:flex-row gap-5 items-center justify-center w-full"
        onChange={onFormChange}
    >
        <Selector
            data={data}
            dataKey="faculties"
            name="facultyId"
            placeholder={placeholders.faculty}
            defaultValue={searchParams.get("facultyId") || undefined}
        />

        <Selector
            key={`course-${searchParams.get("facultyId")}`}

            data={data}
            dataKey="courses"
            name="course"
            placeholder={placeholders.course}
            defaultValue={searchParams.get("course") || undefined}
        />

        <Selector
            key={`group-${searchParams.get("course")}`}
        
            data={data}
            dataKey="groups"
            name="groupId"
            placeholder={placeholders.group}
            defaultValue={searchParams.get("groupId") || undefined}
        />

        <Selector
            key={`student-${searchParams.get("groupId")}`}
        
            data={data}
            dataKey="students"
            name="studentId"
            placeholder={placeholders.student}
            defaultValue={searchParams.get("studentId") || undefined}
        />

        {isSubmitting && <Spinner className="flex-none size-6" />}
    </form>
}
