import { JsonRpcProvider } from "@ethersproject/providers";
import { ALL_SUPPORTED_CHAINS_MAP, type SupportedChainId } from "@cowprotocol/cow-sdk";
import { cacheableByChain } from "./cacheableByChain.ts";

export const getRpcProvider = cacheableByChain((chainId: SupportedChainId) => {
    return new JsonRpcProvider(ALL_SUPPORTED_CHAINS_MAP[chainId].rpcUrls.default.http[0]);
})