import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { TokenAmount } from "../TokenAmount";

interface CompareItemProps {
    label: string
    quote: bigint | string
    order: bigint | string
    token: TokenInfo
}

export function CompareItem({label, quote, order, token}: CompareItemProps) {
    const quoteValue = BigInt(quote)
    const orderValue = BigInt(order)

    return (
        <div className="compare-item">
            <div>
                <span>{label}:</span>
                <TokenAmount value={quoteValue} opposite={orderValue} token={token}/>
            </div>
            <div>
                <span>{label}:</span>
                <TokenAmount value={orderValue} opposite={quoteValue} token={token}/>
            </div>
        </div>
    )
}