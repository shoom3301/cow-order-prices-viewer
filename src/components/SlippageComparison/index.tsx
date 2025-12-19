import "./index.css";
import type { FullOrder } from "../../types.ts";
import { getAppDataParams } from "../../logic/getAppDataParams.ts";
import { getAmountBasedSlippage } from "../../logic/getAmountBasedSlippage.ts";
import { getOrderBuyAmountAfterFees } from "../../logic/getOrderBuyAmountAfterFees.ts";
import { getQuoteAmounts } from "../../logic/getQuoteAmounts.ts";
import type { TokenInfo } from "@cowprotocol/cow-sdk";

const SLIPAGE_PRECISION = 12

interface SlippageComparisonProps {
    order: FullOrder
    sellToken: TokenInfo
    buyToken: TokenInfo
}

export function SlippageComparison({order, sellToken, buyToken}: SlippageComparisonProps) {
    const { slippagePercentBps } = getAppDataParams(order)
    const orderBuyAfterFees = getOrderBuyAmountAfterFees(order)
    const quoteAmounts = getQuoteAmounts(order, sellToken, buyToken)

    const orderBuyAfterSlippage = BigInt(order.buyAmount)

    const appDataSlippagePercent = slippagePercentBps / 100
    const quoteSlippagePercent = getAmountBasedSlippage(
        quoteAmounts.afterPartnerFees.buyAmount,
        quoteAmounts.afterSlippage.buyAmount
    )
    const orderSlippagePercent = getAmountBasedSlippage(orderBuyAfterFees, orderBuyAfterSlippage)

    console.log('SlippageComparison', {
        orderSlippagePercent,
        orderBuyAfterFees,
        orderAfterSlippage: orderBuyAfterSlippage,
        getAmountBasedSlippage
    })
    return (
        <div>
            <h3>Slippage comparison:</h3>
            <div className="slippage-comparison">
                <div>
                    <label>App-data slippage: </label>
                    <strong title={appDataSlippagePercent.toString()}>
                        {appDataSlippagePercent.toFixed(SLIPAGE_PRECISION)}%
                    </strong>
                </div>
                <div className={quoteSlippagePercent < appDataSlippagePercent ? 'slippage_invalid' : ''}>
                    <label>Quote slippage (based on order amounts): </label>
                    <strong title={quoteSlippagePercent.toString()}>
                        {quoteSlippagePercent.toFixed(SLIPAGE_PRECISION)}%
                    </strong>
                </div>
                <div className={orderSlippagePercent < appDataSlippagePercent ? 'slippage_invalid' : ''}>
                    <label>Order slippage (based on order amounts): </label>
                    <strong title={orderSlippagePercent.toString()}>
                        {orderSlippagePercent.toFixed(SLIPAGE_PRECISION)}%
                    </strong>
                    {orderSlippagePercent < appDataSlippagePercent
                        ? <div className="low-order-slippage-warning">
                            Slippage derived from order amounts is <strong>less</strong> than app-data slippage!
                            This might lead this order to be not filled!
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}