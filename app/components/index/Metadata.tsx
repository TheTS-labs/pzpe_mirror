import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { History, X } from "lucide-react";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useIntlayer } from "react-intlayer";
import { Spinner } from "../ui/spinner";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export interface MetadataProps {
    createdAt?: number,
    onRefresh: () => void,
    loading?: boolean,
    error?: boolean,
}

export default function Metadata(props: MetadataProps) {
    const { cachedAt, refresh } = useIntlayer("schedule");

    return <Item className="w-full text-muted-foreground">
        <ItemMedia variant="icon">
            <History />
        </ItemMedia>
        <ItemContent>
            <ItemTitle>{cachedAt} {dayjs(props.createdAt).fromNow()}</ItemTitle>
        </ItemContent>
        <ItemActions>
            <Button
                size="sm"
                variant="ghost"
                onClick={props.onRefresh}
                disabled={props.loading || props.error}
                className={props.error ? "text-red-400" : ""}
            >
                {props.loading && <Spinner />}
                {props.error && <X />}
                {refresh}
            </Button>
        </ItemActions>
    </Item>;
}
