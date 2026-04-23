import { AxiomWithoutBatching } from "@axiomhq/js";
import { waitUntil } from "@vercel/functions";
import { AsyncLocalStorage } from "node:async_hooks";

const noAxiom = !process.env.AXIOM_DATASET_NAME || !process.env.AXIOM_TOKEN;

const DATASET = process.env.AXIOM_DATASET_NAME!;
const axiom = new AxiomWithoutBatching({
    token: process.env.AXIOM_TOKEN!,
});

const logContext = new AsyncLocalStorage<{ reqId: string, ua?: string }>();

export function withLogger<T, A extends { request: Request }>(handler: (args: A) => Promise<T>) {
    return async (args: A) => {
        const ua = args.request.headers.get("User-Agent") || undefined;
        const reqId = args.request.headers.get("x-vercel-id") || crypto.randomUUID();

        return logContext.run({ reqId, ua }, () => handler(args));
    };
}

export type LogKind = "core" | "cache" | "parsing" | "error";

export default function log(kind: LogKind, payload: object) {
    const store = logContext.getStore();
    const event = { kind, ...payload, ...store };

    if (noAxiom) {
        console.log(event);
        return;
    }

    waitUntil(axiom.ingest(DATASET, [event]));
}
