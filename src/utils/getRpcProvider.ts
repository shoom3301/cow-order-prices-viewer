import { JsonRpcProvider } from "@ethersproject/providers";
import type { EvmChainInfo } from "@cowprotocol/sdk-config";
import { ALL_SUPPORTED_CHAINS_MAP, type SupportedChainId } from "@cowprotocol/cow-sdk";
import { cacheableByChain } from "./cacheableByChain.ts";

export const getRpcProvider = cacheableByChain((chainId: SupportedChainId) => {
    const chain = ALL_SUPPORTED_CHAINS_MAP[chainId] as EvmChainInfo

    return new JsonRpcProvider(chain.rpcUrls.default.http[0]);
})