import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Res, Result } from "~/lib/portal";
import { Select as SelectPrimitive } from "radix-ui"

export type SelectorProps = {
    data: Promise<Result<Res>>,
    dataKey: Exclude<keyof Res, "schedule">,
    placeholder?: string,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: { loading?: boolean, placeholder?: string }) {
    return <SelectTrigger className="w-full md:grow" loading={props.loading}>
        <SelectValue placeholder={props.placeholder} />
    </SelectTrigger>
}

function Fallback(props: Pick<SelectorProps, "placeholder">) {
    return <Select disabled>
        <Trigger {...props} />
    </Select>
}

function Resolved(props: SelectorProps) {
    const resolved = useAsyncValue() as Awaited<SelectorProps["data"]>;

    if (!resolved.result || resolved.result[props.dataKey].length === 0) {
        return < Fallback placeholder={props.placeholder} />;
    }

    return <Select {...props}>
        <Trigger placeholder={props.placeholder} />

        <SelectContent 
            position="popper" 
            className="w-[var(--radix-select-trigger-width)] min-w-[200px] max-h-[300px]"
        >
            {resolved.result[props.dataKey].map(([key, value]) => (
                <SelectItem 
                    key={key} 
                    value={key.toString()}
                    className="whitespace-normal leading-tight py-2"
                >
                    {value}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>;
}

export default function Selector(props: SelectorProps) {
    return <Suspense fallback={<Fallback placeholder={props.placeholder} />}>
        <Await resolve={props.data}>
            <Resolved {...props} />
        </Await>
    </Suspense>;
}
