import { SpeedInsights } from "@vercel/speed-insights/react";
import { useLocation } from "react-router";

export function RouteSpeedInsights() {
    const location = useLocation();

    return <SpeedInsights route={location.pathname} />;
}
