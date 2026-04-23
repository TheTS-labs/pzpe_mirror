import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";
import log from "./log.server";

const redis = Redis.fromEnv();

export interface Payload<T> {
    value: T,
    metadata?: Metadata
}

interface Metadata {
    createdAt: number;
    staleAt: number;
}

interface CachePayload<T> {
    value: T;
    metadata: Metadata;
}

export async function manageCache<T>(key: string, ex: number, revalidate: () => Promise<T>, ignoreCache = false): Promise<Payload<T>> {
    const payload = ignoreCache ? null : await redis.get<CachePayload<T>>(key);
    if (!payload || !payload.value || !payload.metadata) {
        log("cache", { status: "miss", key, ignoreCache });

        const value = await revalidate();

        waitUntil(writeCache(key, value, ex));

        return { value };
    }
    
    log("cache", { status: "hit", key });

    waitUntil((async () => {
        if (Date.now() > payload.metadata.staleAt) {
            log("cache", { status: "revalidate", key });

            const value = await revalidate().catch(err => {
                log("cache", { status: "revalidate_fail", key, err });

                throw err;
            });

            await writeCache(key, value, ex);
        }
    })());

    return payload;
}

async function writeCache(key: string, value: unknown, ex: number) {
    const createdAt = Date.now();

    const payload: CachePayload<unknown> = {
        value,
        metadata: {
            createdAt,
            staleAt: createdAt + (ex / 2) * 1000,
        },
    };

    await redis.set(key, payload, { ex });

    log("cache", { status: "write", key });
}
