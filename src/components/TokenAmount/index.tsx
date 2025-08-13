import type { TokenInfo } from "@cowprotocol/cow-sdk";

interface TokenAmountProps {
    value: bigint
    token: TokenInfo
}

export function TokenAmount({value, token}: TokenAmountProps) {
    const viewAmount = value / BigInt(10 ** token.decimals)

    return `${viewAmount.toString()} ${token.symbol}`
}