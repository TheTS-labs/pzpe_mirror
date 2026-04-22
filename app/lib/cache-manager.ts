import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";

const redis = Redis.fromEnv();

interface Metadata {
    createdAt: number;
    staleAt: number;
}

interface CachePayload<T> {
    value: T;
    metadata: Metadata;
}

export async function manageCache<T>(key: string, ex: number, revalidate: () => Promise<T>): Promise<T> {
    const payload = await redis.get<CachePayload<T>>(key);
    if (!payload || !payload.value || !payload.metadata) {
        const value = await revalidate();

        waitUntil(writeCache(key, value, ex));

        return value;
    }

    waitUntil((async () => {
        if (Date.now() > payload.metadata.staleAt) {
            const value = await revalidate();
            await writeCache(key, value, ex);
        }
    })());

    return payload.value;
}

async function writeCache(key: string, value: unknown, ex: number) {
    const createdAt = Date.now();

    const payload: CachePayload<unknown> = {
        value,
        metadata: {
            createdAt,
            staleAt: createdAt + (ex / 2) * 1000
        }
    };

    await redis.set(key, payload, { ex });
}
