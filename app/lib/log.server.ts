import { AxiomWithoutBatching } from "@axiomhq/js";
import { waitUntil } from "@vercel/functions";
import { AsyncLocalStorage } from "node:async_hooks";

const DATASET = process.env.AXIOM_DATASET_NAME!;
const axiom = new AxiomWithoutBatching({
    token: process.env.AXIOM_TOKEN!,
});

const logContext = new AsyncLocalStorage<{ reqId: string }>();

export function withLogger<T, A>(handler: (args: A) => Promise<T>) {
    return async (args: A) => logContext.run({ reqId: crypto.randomUUID() }, () => handler(args));
}

export type LogKind = "core" | "cache" | "parsing" | "error";

export default function log(kind: LogKind, payload: object) {
    const store = logContext.getStore();

    if (process.env.NODE_ENV === "development") {
        console.log("[AXIOM]", { kind, ...payload, ...store });
        return;
    }

    waitUntil((async () => {
        await axiom.ingest(DATASET, [{ kind, ...payload, ...store }]);
    })());
}
