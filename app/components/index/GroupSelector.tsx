import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Select as SelectPrimitive } from "radix-ui"
import type { Groups } from "~/lib/portal/groups";

export type GroupSelectorProps = {
    groups: Groups | undefined,
    loading?: boolean,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: { loading?: boolean }) {
    return <SelectTrigger className="w-[180px]" {...props}>
        <SelectValue placeholder="-- Group --" />
    </SelectTrigger>
}

function Fallback({ loading }: { loading?: boolean }) {
    return <Select disabled>
        <Trigger loading={loading} />
    </Select>
}

export default function GroupSelector(props: GroupSelectorProps) {
    if (!props.groups || props.loading) { return <Fallback loading={props.loading} /> }

    return <Select {...props}>
        <Trigger />
        
        <SelectContent position="popper">
            <SelectGroup>
                {props.groups.map(group => (
                    <SelectItem key={group[0]} value={group[0].toString()}>{group[1]}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}