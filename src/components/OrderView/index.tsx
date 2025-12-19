import "./index.css";
import { useOrderContextStore } from "../../state/orderContext.ts";
import { CompareItem } from "../CompareItem";
import { useErc20Token } from "../../hooks/useErc20Token.ts";
import { getFeeFromQuote } from "../../logic/getFeeFromQuote.ts";
import { getQuoteAmounts } from "../../logic/getQuoteAmounts.ts";
import { getOrderBuyAmountAfterFees } from "../../logic/getOrderAmountAfterFees.ts";
import { OrderParams } from "../OrderParams";
import { QuoteBreakdown } from "../QuoteBreakdown";
import { OrderTokens } from "../OrderTokens";
import { SlippageComparison } from "../SlippageComparison";
import { RawOrderBreakdown } from "../RawOrderBreakdown";
import { AmountsExplanation } from "../AmountsExplanation";

export function OrderView() {
    const {chainId, order} = useOrderContextStore()

    const sellToken = useErc20Token(chainId, order?.sellToken ?? null)
    const buyToken = useErc20Token(chainId, order?.buyToken ?? null)

    if (!order) {
        return (
            <div className="content">
                <p>1. Select chain</p>
                <p>2. Specify order Id</p>
            </div>
        )
    }

    if (!sellToken || !buyToken) {
        return (
            <div className="content">Loading...</div>
        )
    }

    const quoteFeeInSellToken = getFeeFromQuote(order.quote)
    const quoteAmountsData = getQuoteAmounts(order, sellToken, buyToken)
    const {result: quoteAmounts} = quoteAmountsData
    const orderBuyAfterFees = getOrderBuyAmountAfterFees(order)

    const quoteAfterSlippage = quoteAmounts.afterSlippage.buyAmount
    const orderAfterSlippage = BigInt(order.buyAmount)

    const isOrderSlippageValid = orderAfterSlippage <= quoteAfterSlippage

    return (
        <div>
            <OrderParams order={order}/>
            <OrderTokens sellToken={sellToken} buyToken={buyToken}/>
            {!isOrderSlippageValid && (
                <div className="invalid-slippage-banner">
                    Order slippage is invalid!
                    Order "Min. receive amount" should not be greater than quote "Min. receive amount"!
                </div>
            )}
            <SlippageComparison order={order} sellToken={sellToken} buyToken={buyToken}/>
            <section className="section comparison-section">
                <h3>Quote vs Order</h3>

                <div className="order-view-table">
                    <div className="order-view-table-header">
                        <h3>Quote</h3>
                    </div>
                    <div className="order-view-table-header">
                        <h3>Order</h3>
                    </div>

                    <CompareItem label="Sell amount"
                                 quote={order.quote.sellAmount}
                                 order={order.sellAmount}
                                 token={sellToken}/>

                    <CompareItem label="After fees amount"
                                 quote={quoteAmounts.afterPartnerFees.buyAmount}
                                 order={orderBuyAfterFees}
                                 token={buyToken}/>

                    <CompareItem label="Min. receive amount"
                                 quote={quoteAmounts.afterSlippage.buyAmount}
                                 order={order.buyAmount}
                                 token={buyToken}/>

                    <CompareItem label="Expected fee amount"
                                 orderLabel="Executed fee amount"
                                 tooltipQuote="gasAmount * gasPrice / sellTokenPrice"
                                 quote={quoteFeeInSellToken}
                                 order={order.executedFee || null}
                                 token={sellToken}/>

                    <CompareItem label="Expected buy amount"
                                 orderLabel="Executed buy amount"
                                 quote={order.quote.buyAmount}
                                 order={order.executedBuyAmount}
                                 token={buyToken}/>
                </div>
            </section>

            <div className="breakdowns-grid">
                <RawOrderBreakdown order={order}/>
                <QuoteBreakdown quoteAmounts={quoteAmounts}/>
                <AmountsExplanation amountsAndCosts={quoteAmountsData.result} params={quoteAmountsData.params}/>
            </div>
        </div>
    )
}