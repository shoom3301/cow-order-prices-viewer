import "./index.css";
import type { QuoteAmountsAndCosts } from "@cowprotocol/cow-sdk";
import { stringifyWithBigInt } from "../../utils/stringifyWithBigInt.ts";

interface QuoteBreakdownProps {
    quoteAmounts: QuoteAmountsAndCosts<bigint>
}

export function QuoteBreakdown({quoteAmounts}: QuoteBreakdownProps) {
    return (
        <div>
            <h3>Quote amounts breakdown</h3>
            <pre className="quote-breakdown">
            {stringifyWithBigInt(quoteAmounts, 4)}
        </pre>
        </div>
    )
}