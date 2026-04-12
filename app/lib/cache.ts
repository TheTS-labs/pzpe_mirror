export interface Metadata {
    createdAt: number,
    staleAt: number | undefined,
}

export async function getCache<T>(key: string, kv: KVNamespace): Promise<{ value: T, metadata: Metadata } | undefined> {
    const { value, metadata } = await kv.getWithMetadata<Metadata>(key);
    if (!value || !metadata) { return undefined; }

    return { value: JSON.parse(value), metadata };
}

export async function setCache(key: string, value: unknown, kv: KVNamespace, options?: KVNamespacePutOptions) {
    const stringValue = JSON.stringify(value);
    const createdAt = Date.now();

    return kv.put(key, stringValue, {
        ...options,
        metadata: {
            createdAt,
            staleAt: options?.expirationTtl && (createdAt + (options?.expirationTtl / 2) * 1000)
        } satisfies Metadata,
    });
}
