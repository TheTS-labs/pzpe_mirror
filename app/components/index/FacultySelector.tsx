import { Suspense } from "react";
import { Await } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import type { InitPortal } from "~/lib/portal/init";

export interface FacultySelectorProps {
    init: Promise<InitPortal>
}

function Fallback() {
    return <Select disabled>
        <SelectTrigger className="w-[180px]" loading>
            <SelectValue placeholder="-- Faculty --" />
        </SelectTrigger>
    </Select>
}

function Resolved({ resolved }: { resolved: InitPortal }) {
    return <Select>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="-- Faculty --" />
        </SelectTrigger>
        
        <SelectContent position="popper">
            <SelectGroup>
                {resolved.faculties.map(faculty => (
                    <SelectItem key={faculty[0]} value={faculty[0].toString()}>{faculty[1]}</SelectItem>)
                )}
            </SelectGroup>
        </SelectContent>
    </Select>;
}

export default function FacultySelector({ init }: FacultySelectorProps) {
    return <Suspense fallback={<Fallback />}>
        <Await resolve={init}>
            {resolved => <Resolved resolved={resolved} />}
        </Await>
    </Suspense>
}