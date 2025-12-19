import "./index.css";
import type { QuoteAmountsAndCosts, QuoteAmountsAndCostsParams } from "@cowprotocol/cow-sdk";
import { stringifyWithBigInt } from "../../utils/stringifyWithBigInt.ts";
import { quoteAmountsAndCostsBreakdown } from "../../logic/quoteAmountsAndCostsBreakdown.ts";

interface AmountsExplanationProps {
    params: QuoteAmountsAndCostsParams
    amountsAndCosts: QuoteAmountsAndCosts
}

export function AmountsExplanation({params, amountsAndCosts}: AmountsExplanationProps) {
    return (
        <div>
            <h3>Amounts verbose</h3>
            <textarea>
            {stringifyWithBigInt(quoteAmountsAndCostsBreakdown(params, amountsAndCosts), 4)}
        </textarea>
        </div>
    )
}