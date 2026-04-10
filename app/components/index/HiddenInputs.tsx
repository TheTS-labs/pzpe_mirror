import { Suspense } from "react";
import { Await, useAsyncValue } from "react-router";
import type { InitPortal } from "~/lib/portal/init";

export interface HiddenInputsProps {
    init: Promise<InitPortal>,
}

function Resolved() {
    const resolved = useAsyncValue() as InitPortal;

    return <>
        <input type="hidden" name="csrf_token" value={resolved.csrf_token} />
        <input type="hidden" name="meta_csrf_token" value={resolved.meta_csrf_token} />
        <input type="hidden" name="cookies" value={resolved.cookies} />
    </>;
}

export default function HiddenInputs(props: HiddenInputsProps) {
    return <Suspense fallback={<></>}>
        <Await resolve={props.init} errorElement={<></>}>
            <Resolved />
        </Await>
    </Suspense>
}