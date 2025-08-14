import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { firstDiffIndex } from "../../utils/firstDiffIndex.ts";
import { getAmountsDiffPercent } from "../../utils/getAmountsDiffPercent.ts";

const ACCURACY_THRESHOLD = 99.99

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

    const diffPercent = getAmountsDiffPercent(+viewAmount, oppositeAmount === false ? null : +oppositeAmount)

    const isAccurate = diffPercent !== null && diffPercent > ACCURACY_THRESHOLD && diffPercent <= 100

    const diffIndex = oppositeAmount === false ? -1 : firstDiffIndex(viewAmount, oppositeAmount)

    const view = diffIndex === -1
        ? <span className="amount-diff-highlight_green">{viewAmount}</span>
        : (
            <>
                <span>{viewAmount.slice(0, diffIndex)}</span>
                <span title={diffPercent === null ? '' : `Diff: ${diffPercent.toFixed(4)}$`}
                      className={`${isAccurate ? 'amount-diff-highlight_yellow' : 'amount-diff-highlight'}`}>
                    {viewAmount.slice(diffIndex, viewAmount.length)}
                </span>
            </>
        )

    return <>{view} {token.symbol}</>
}