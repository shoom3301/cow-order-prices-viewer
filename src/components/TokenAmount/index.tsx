import type { TokenInfo } from "@cowprotocol/cow-sdk";

interface TokenAmountProps {
    value: bigint
    token: TokenInfo
}

export function TokenAmount({value, token}: TokenAmountProps) {
    const viewAmount = +String(value) / (10 ** token.decimals)

    return `${viewAmount.toFixed(token.decimals)} ${token.symbol}`
}