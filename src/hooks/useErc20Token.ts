import { useEffect, useState } from "react";
import { fetchErc20Token } from "../utils/fetchErc20Token.ts";
import { ALL_SUPPORTED_CHAINS_MAP, ETH_ADDRESS, type SupportedChainId, type TokenInfo } from "@cowprotocol/cow-sdk";
import { useOrderContextStore } from "../state/orderContext.ts";

export function useErc20Token(chainId: SupportedChainId, address: string | null): TokenInfo | null {
    const [token, setToken] = useState<TokenInfo | null>(null)
    const rpcUrl = useOrderContextStore(state => state.rpcUrlByChain[chainId])

    useEffect(() => {
        if (!address) return

        if (address.toLowerCase() === ETH_ADDRESS.toLowerCase()) {
            setToken(ALL_SUPPORTED_CHAINS_MAP[chainId].nativeCurrency)
            return
        }

        fetchErc20Token(chainId, address, rpcUrl).then(setToken)
    }, [chainId, address, rpcUrl]);

    return token
}