import { useEffect, useState } from "react";
import pingSite from "~/lib/ping";
import { PING_URL } from "~/lib/portal";

export const COLOR_UNKNOWN = "text-neutral-500";
export const COLOR_ONLINE = "text-green-500"
export const COLOR_OFFLINE = "text-red-500"

export default function Header() {
    const [color, setColor] = useState<string>(COLOR_UNKNOWN);

    useEffect(() => {
        const checkStatus = () => {
            pingSite(PING_URL)
                .then(() => setColor(COLOR_ONLINE))
                .catch(() => setColor(COLOR_OFFLINE));
        };
        
        checkStatus();

        const interval = setInterval(checkStatus, 10_000);

        return () => clearInterval(interval);
    }, []);

    return <div className="flex flex-col items-center gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ">
            <span className={color}>PZPE</span> Mirror
        </h1>

        <p className="text-center max-w-prose text-neutral-500">
            A fast, reliable, and open-source interface for Portal. Enjoy a beautiful modern UI and request caching that eliminates downtime forever
        </p>
    </div>;
}
