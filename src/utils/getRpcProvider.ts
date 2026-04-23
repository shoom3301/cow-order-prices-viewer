import { JsonRpcProvider } from "@ethersproject/providers";
import type { EvmChainInfo } from "@cowprotocol/sdk-config";
import { ALL_SUPPORTED_CHAINS_MAP, type SupportedChainId } from "@cowprotocol/cow-sdk";

const cache = new Map<string, JsonRpcProvider>()

export function getRpcProvider(chainId: SupportedChainId, rpcUrl?: string): JsonRpcProvider {
    const chain = ALL_SUPPORTED_CHAINS_MAP[chainId] as EvmChainInfo
    const url = rpcUrl ?? chain.rpcUrls.default.http[0]
    const key = `${chainId}:${url}`

    const cached = cache.get(key)
    if (cached) return cached

    const provider = new JsonRpcProvider(url)
    cache.set(key, provider)
    return provider
}