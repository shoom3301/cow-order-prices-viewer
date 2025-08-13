import type { SupportedChainId } from "@cowprotocol/cow-sdk";

export function cacheableByChain<T>(getter: (chainId: SupportedChainId) => T): typeof getter {
    const cache = new Map<SupportedChainId, T>()

    return (chainId: SupportedChainId) => {
        const cached = cache.get(chainId)

        if (cached) return cached

        const instance = getter(chainId)

        cache.set(chainId, instance)

        return instance
    }
}
