import { Suspense } from "react";
import { Await, useSearchParams } from "react-router";
import type { Result, Res } from "~/lib/portal";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { CircleX } from "lucide-react";
import { Button } from "../ui/button";
import { useIntlayer } from "react-intlayer";

export interface ErrorProps {
    data: Promise<Result<Res>>,
}

export default function Error(props: ErrorProps) {
    const { errors, actions, title } = useIntlayer("errors");
    const [searchParams, setSearchParams] = useSearchParams();

    const retry = () => setSearchParams(searchParams, { replace: true });
    const clear = () => setSearchParams({}, { replace: true });

    return <Suspense>
        <Await resolve={props.data}>
            {({ errCode }) => errCode && <Item variant="outline" className="md:max-w-prose w-full">
                <ItemMedia variant="icon">
                    <CircleX />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>{title}</ItemTitle>
                    <ItemDescription>
                        {errors[errCode]}
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button size="sm" onClick={errCode == "origin_request_failed" ? retry : clear}>
                        {errCode == "origin_request_failed" ? actions.retry : actions.clear}
                    </Button>
                </ItemActions>
            </Item>}
        </Await>
    </Suspense>
}
