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
    return (
        <div className="compare-item">
            <div>
                <span>{label}:</span>
                <TokenAmount value={BigInt(quote)} token={token}/>
            </div>
            <div>
                <span>{label}:</span>
                <TokenAmount value={BigInt(order)} token={token}/>
            </div>
        </div>
    )
}