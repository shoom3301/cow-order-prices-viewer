import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { firstDiffIndex } from "../../utils/firstDiffIndex.ts";

interface TokenAmountProps {
    value: bigint
    opposite: bigint
    token: TokenInfo
}

function getAmountView(value: bigint, token: TokenInfo): string {
    return (+String(value) / (10 ** token.decimals)).toFixed(token.decimals)
}

export function TokenAmount({value, opposite, token}: TokenAmountProps) {
    const viewAmount = getAmountView(value, token)
    const oppositeAmount = getAmountView(opposite, token)

    const diffIndex = firstDiffIndex(viewAmount, oppositeAmount)

    const view = diffIndex === -1
        ? viewAmount
        : <>
            <span>{viewAmount.slice(0, diffIndex)}</span>
            <span className="amount-diff-highlight">{viewAmount.slice(diffIndex, viewAmount.length)}</span>
        </>

    return <>{view} {token.symbol}</>
}