import { Select as SelectPrimitive } from "radix-ui"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";

export type CourseSelectorProps = React.ComponentProps<typeof SelectPrimitive.Root>;

export default function CourseSelector(props: CourseSelectorProps) {
    return <Select {...props}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="-- Course --" />
        </SelectTrigger>
        
        <SelectContent position="popper">
            <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
}