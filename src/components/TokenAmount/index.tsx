import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { firstDiffIndex } from "../../utils/firstDiffIndex.ts";

interface TokenAmountProps {
    value: bigint
    opposite: bigint | false
    token: TokenInfo
}

function getAmountView(value: bigint, token: TokenInfo): string {
    // TODO: it's not precise
    return (+String(value) / (10 ** token.decimals)).toFixed(token.decimals)
}

export function TokenAmount({value, opposite, token}: TokenAmountProps) {
    const viewAmount = getAmountView(value, token)
    const oppositeAmount = opposite !== false && getAmountView(opposite, token)

    const diffIndex = oppositeAmount === false ? -1 : firstDiffIndex(viewAmount, oppositeAmount)

    const view = diffIndex === -1
        ? viewAmount
        : <>
            <span>{viewAmount.slice(0, diffIndex)}</span>
            <span className="amount-diff-highlight">{viewAmount.slice(diffIndex, viewAmount.length)}</span>
        </>

    return <>{view} {token.symbol}</>
}