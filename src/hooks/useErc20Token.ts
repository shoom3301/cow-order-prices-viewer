import { useEffect, useState } from "react";
import { fetchErc20Token } from "../utils/fetchErc20Token.ts";
import { ALL_SUPPORTED_CHAINS_MAP, ETH_ADDRESS, type SupportedChainId, type TokenInfo } from "@cowprotocol/cow-sdk";

export function useErc20Token(chainId: SupportedChainId, address: string | null): TokenInfo | null {
    const [token, setToken] = useState<TokenInfo | null>(null)

    useEffect(() => {
        if (!address) return

        if (address.toLowerCase() === ETH_ADDRESS.toLowerCase()) {
            setToken(ALL_SUPPORTED_CHAINS_MAP[chainId].nativeCurrency)
            return
        }

        fetchErc20Token(chainId, address).then(setToken)
    }, [chainId, address]);

    return token
}