import { type SupportedChainId, type TokenInfo } from "@cowprotocol/cow-sdk";
import { Contract } from "@ethersproject/contracts";
import { getRpcProvider } from "./getRpcProvider.ts";

const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address account) view returns (uint256)"
];

export function fetchErc20Token(chainId: SupportedChainId, address: string): Promise<TokenInfo> {
    const provider = getRpcProvider(chainId)
    const tokenContract = new Contract(address, abi, provider);

    return Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals()
    ]).then(([symbol, decimals]) => ({
        chainId, address, symbol, decimals
    }))
}
