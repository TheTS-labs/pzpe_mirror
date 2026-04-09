import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";

export default function Home() {
  return <>
    <Select>
      <SelectTrigger className="w-[1800px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </>;
}
