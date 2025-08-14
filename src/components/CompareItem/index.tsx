import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { TokenAmount } from "../TokenAmount";

interface CompareItemProps {
    label: string
    orderLabel?: string
    tooltipQuote?: string
    tooltipOrder?: string
    quote: bigint | number | string | null
    order: bigint | number | string | null
    token: TokenInfo
}

export function CompareItem({label, orderLabel, quote, order, token, tooltipQuote, tooltipOrder }: CompareItemProps) {
    const quoteValue = quote !== null && BigInt(quote)
    const orderValue = order !== null && BigInt(order)

    return (
        <div className="compare-item">
            <div>
                <span title={tooltipQuote}>{quoteValue !== false && `${label}: `}</span>
                {quoteValue === false ? '' : <TokenAmount value={quoteValue} opposite={orderValue} token={token}/>}
            </div>
            <div>
                <span title={tooltipOrder}>{orderValue !== false && `${orderLabel ?? label}: `}</span>
                {orderValue === false ? '' : <TokenAmount value={orderValue} opposite={quoteValue} token={token}/>}
            </div>
        </div>
    )
}