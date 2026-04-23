import type { Result } from ".";
import log from "../log.server";
import PortalError from "./portal-error.server";

export async function errorBoundary<Ret>(
    fn: () => Promise<Ret>,
): Promise<Result<Ret>> {
    return fn()
        .then(result => ({ result }))
        .catch((err: unknown) => {
            if (err instanceof PortalError) {
                return { errCode: err.errCode }; 
            }

            log("error", { where: "errorBoundary", err });

            throw err; 
        });
}
