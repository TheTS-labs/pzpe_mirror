import { Suspense } from "react";
import { Await } from "react-router";

export const COLOR_UNKNOWN = "text-neutral-500";
export const COLOR_ONLINE = "text-green-500"
export const COLOR_OFFLINE = "text-red-500"

export interface HeaderProps {
    head: Promise<boolean>
}

function Status({ head }: HeaderProps) {
    return <Suspense fallback={<span className={COLOR_UNKNOWN}>PZPE</span>}>
        <Await resolve={head} errorElement={<span className={COLOR_OFFLINE}>PZPE</span>}>
            {resolved => <span className={resolved ? COLOR_ONLINE : COLOR_OFFLINE}>PZPE</span>}
        </Await>
    </Suspense>
}

export default function Header({ head }: HeaderProps) {
    return <div className="flex flex-col items-center gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ">
            <Status head={head} /> Mirror
        </h1>

        <p className="text-center max-w-prose text-neutral-500">
            A fast, reliable, and open-source interface for Portal. Enjoy a beautiful modern UI and request caching that eliminates downtime forever
        </p>
    </div>;
}
