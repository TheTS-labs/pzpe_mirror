import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { History } from "lucide-react";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useIntlayer } from "react-intlayer";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export interface MetadataProps {
    createdAt?: number
}

export default function Metadata(props: MetadataProps) {
    const { cachedAt, refresh } = useIntlayer("schedule");

    return <Item className="w-full max-w-4xl md:max-w-2xl text-muted-foreground">
        <ItemMedia variant="icon">
            <History />
        </ItemMedia>
        <ItemContent>
            <ItemTitle>{cachedAt} {dayjs(props.createdAt).fromNow()}</ItemTitle>
        </ItemContent>
        <ItemActions>
            <Button size="sm" variant="ghost">
                {refresh}
            </Button>
        </ItemActions>
    </Item>
}
