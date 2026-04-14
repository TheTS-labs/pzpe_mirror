import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import type { Faculties } from "~/lib/portal/get-init";
import { Select as SelectPrimitive } from "radix-ui"
import { useIntlayer } from "react-intlayer";

export type FacultySelectorProps = {
    faculties: Promise<Faculties>,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: { loading?: boolean }) {
    const { placeholders } = useIntlayer("form");

    return <SelectTrigger className="w-full md:grow" {...props}>
        <SelectValue placeholder={placeholders.faculty} />
    </SelectTrigger>
}

function Fallback() {
    return <Select disabled>
        <Trigger loading />
    </Select>
}

function Resolved(props: FacultySelectorProps) {
    const resolved = useAsyncValue() as Faculties;

    return <Select {...props} name="facultyId">
        <Trigger />
        
        <SelectContent 
            position="popper" 
            className="w-[var(--radix-select-trigger-width)] min-w-[200px] max-h-[300px]"
        >
            <SelectGroup>
                {resolved.map(faculty => (
                    <SelectItem 
                        key={faculty[0]} 
                        value={faculty[0].toString()}
                        className="whitespace-normal leading-tight py-2"
                    >
                        {faculty[1]}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>;
}

function Rejected() {
    const { facultiesRejected } = useIntlayer("form");

    return <div className="flex flex-col gap-2">
        <Select disabled>
            <Trigger />
        </Select>

        <p className="text-[0.8rem] font-medium text-destructive">
            {facultiesRejected}
        </p>
    </div>;
}

export default function FacultySelector(props: FacultySelectorProps) {
    return <Suspense fallback={<Fallback />}>
        <Await resolve={props.faculties} errorElement={<Rejected />}>
            <Resolved {...props} />
        </Await>
    </Suspense>
}
