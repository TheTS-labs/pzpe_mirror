import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Res, Result } from "~/lib/portal";
import { Select as SelectPrimitive } from "radix-ui";

export type SelectorProps = {
    data: Promise<Result<Res>>,
    dataKey: Exclude<keyof Res, "schedule" | "cacheCreatedAt">,
    placeholder?: string,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: { loading?: boolean, placeholder?: string }) {
    return <SelectTrigger className="w-full" loading={props.loading}>
        <SelectValue placeholder={props.placeholder} />
    </SelectTrigger>;
}

function Fallback(props: Pick<SelectorProps, "placeholder">) {
    return <Select disabled>
        <Trigger {...props} />
    </Select>;
}

function Resolved(props: SelectorProps) {
    const resolved = useAsyncValue() as Awaited<SelectorProps["data"]>;

    if (!resolved.result || resolved.result[props.dataKey].length === 0) {
        return < Fallback placeholder={props.placeholder} />;
    }

    return <Select {...props}>
        <Trigger placeholder={props.placeholder} />

        <SelectContent position="popper" className="max-w-[95vw]">
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
    return <div className="flex-1 min-w-0 w-full">
        <Suspense fallback={<Fallback placeholder={props.placeholder} />}>
            <Await resolve={props.data}>
                <Resolved {...props} />
            </Await>
        </Suspense>
    </div>;
}
