import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import type { InitPortal } from "~/lib/portal/init";
import { Select as SelectPrimitive } from "radix-ui"

export type FacultySelectorProps = {
    init: Promise<InitPortal>,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: { loading?: boolean }) {
    return <SelectTrigger className="w-full md:grow" {...props}>
        <SelectValue placeholder="-- Faculty --" />
    </SelectTrigger>
}

function Fallback() {
    return <Select disabled>
        <Trigger loading />
    </Select>
}

function Resolved(props: FacultySelectorProps) {
    const resolved = useAsyncValue() as InitPortal;

    return <Select {...props} name="facultyId">
        <Trigger />
        
        <SelectContent 
            position="popper" 
            className="w-[var(--radix-select-trigger-width)] min-w-[200px] max-h-[300px]"
        >
            <SelectGroup>
                {resolved.faculties.map(faculty => (
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
    return <div className="flex flex-col gap-2">
        <Select disabled>
            <Trigger />
        </Select>

        <p className="text-[0.8rem] font-medium text-destructive">
            Failed to load faculties
        </p>
    </div>;
}

export default function FacultySelector(props: FacultySelectorProps) {
    return <Suspense fallback={<Fallback />}>
        <Await resolve={props.init} errorElement={<Rejected />}>
            <Resolved {...props} />
        </Await>
    </Suspense>
}
