import { kv } from "@vercel/kv";

export interface Metadata {
    createdAt: number;
    staleAt: number | undefined;
}

interface CachePayload<T> {
    value: T;
    metadata: Metadata;
}

export async function getCache<T>(key: string): Promise<{ value: T, metadata: Metadata } | undefined> {
    const payload = await kv.get<CachePayload<T>>(key);
    
    if (!payload || !payload.value || !payload.metadata) { 
        return undefined; 
    }

    return { 
        value: payload.value, 
        metadata: payload.metadata 
    };
}

export async function setCache(
    key: string, 
    value: unknown, 
    options?: { expirationTtl?: number }
) {
    const createdAt = Date.now();
    const payload: CachePayload<unknown> = {
        value,
        metadata: {
            createdAt,
            staleAt: options?.expirationTtl ? createdAt + (options.expirationTtl / 2) * 1000 : undefined
        }
    };

    if (options?.expirationTtl) {
        return kv.set(key, payload, { ex: options.expirationTtl });
    }

    return kv.set(key, payload);
}
