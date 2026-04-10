import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Select as SelectPrimitive } from "radix-ui"

export type SelectorProps = {
    placeholder?: string,
    data: [number, string][] | undefined,
    loading?: boolean,
} & React.ComponentProps<typeof SelectPrimitive.Root>;

function Trigger(props: SelectorProps) {
    return <SelectTrigger className="w-[180px]" loading={props.loading}>
        <SelectValue placeholder={props.placeholder} />
    </SelectTrigger>
}

function Fallback(props: SelectorProps) {
    return <Select disabled>
        <Trigger {...props} />
    </Select>
}

export default function Selector(props: SelectorProps) {
    if (!props.data || props.data.length == 0 || props.loading) { return <Fallback {...props} /> }

    return <Select {...props}>
        <Trigger {...props} />
        
        <SelectContent position="popper">
            <SelectGroup>
                {props.data.map(entry => (
                    <SelectItem key={entry[0]} value={entry[0].toString()}>{entry[1]}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}