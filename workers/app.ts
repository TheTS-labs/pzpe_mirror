import type { ExecutionContext, ExportedHandler } from "@cloudflare/workers-types/experimental";
import { createRequestHandler } from "react-router";

declare module "react-router" {
    export interface AppLoadContext {
        cloudflare: {
            env: Env;
            ctx: ExecutionContext;
        };
    }
}

const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
);

export default {
    async fetch(request, env, ctx) {
        return requestHandler(request as never, {
            cloudflare: { env, ctx },
        }) as never;
    },
} satisfies ExportedHandler<Env>;
