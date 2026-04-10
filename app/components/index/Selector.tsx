import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Select as SelectPrimitive } from "radix-ui"

export type SelectorProps = {
    placeholder?: string,
    data: [number, string][] | undefined,
    loading?: boolean,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: Pick<SelectorProps, "loading" | "placeholder">) {
    return <SelectTrigger className="grow" loading={props.loading}>
        <SelectValue placeholder={props.placeholder} />
    </SelectTrigger>
}

function Fallback(props: Pick<SelectorProps, "loading" | "placeholder">) {
    return <Select disabled>
        <Trigger {...props} />
    </Select>
}

export default function Selector({ placeholder, loading, data, ...props }: SelectorProps) {
    if (!data || data.length == 0 || loading) { return <Fallback placeholder={placeholder} loading={loading} /> }

    return <Select {...props}>
        <Trigger loading={loading} placeholder={placeholder} />
        
        <SelectContent position="popper">
            <SelectGroup>
                {data.map(entry => (
                    <SelectItem key={entry[0]} value={entry[0].toString()}>{entry[1]}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}
