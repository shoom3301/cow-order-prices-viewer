import "./index.css";
import type { FullOrder } from "../../types.ts";
import { getAppDataParams } from "../../logic/getAppDataParams.ts";
import { getAmountBasedSlippage } from "../../logic/getAmountBasedSlippage.ts";
import { getOrderBuyAmountAfterFees, getOrderSellAmountAfterFees } from "../../logic/getOrderAmountAfterFees.ts";
import { getQuoteAmounts } from "../../logic/getQuoteAmounts.ts";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { OrderKind } from "@cowprotocol/sdk-order-book";

const SLIPAGE_PRECISION = 12

interface SlippageComparisonProps {
    order: FullOrder
    sellToken: TokenInfo
    buyToken: TokenInfo
}

export function SlippageComparison({order, sellToken, buyToken}: SlippageComparisonProps) {
    const {slippagePercentBps} = getAppDataParams(order)
    const orderBuyAfterFees = getOrderBuyAmountAfterFees(order)
    const {result: quoteAmounts} = getQuoteAmounts(order, sellToken, buyToken)

    const isSellOrder = order.kind == OrderKind.SELL

    const orderBuyAfterSlippage = BigInt(order.buyAmount)

    const appDataSlippagePercent = slippagePercentBps / 100
    const quoteSlippagePercent = getAmountBasedSlippage(
        isSellOrder ? quoteAmounts.afterPartnerFees.buyAmount : quoteAmounts.afterSlippage.sellAmount,
        isSellOrder ? quoteAmounts.afterSlippage.buyAmount : quoteAmounts.afterPartnerFees.sellAmount
    )
    const orderSlippagePercent = isSellOrder
        ? getAmountBasedSlippage(getOrderBuyAmountAfterFees(order), BigInt(order.buyAmount))
        : getAmountBasedSlippage(getOrderSellAmountAfterFees(order), BigInt(order.sellAmount))

    console.log('SlippageComparison', {
        orderSlippagePercent,
        orderBuyAfterFees,
        orderAfterSlippage: orderBuyAfterSlippage,
        getAmountBasedSlippage
    })
    return (
        <section className="slippage-section">
            <h3>Slippage comparison</h3>
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
        </section>
    )
}