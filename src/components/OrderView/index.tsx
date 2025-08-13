import "./index.css";
import { useOrderContextStore } from "../../state/orderContext.ts";
import { CompareItem } from "../CompareItem";
import { useErc20Token } from "../../hooks/useErc20Token.ts";

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

    const quoteFee = (+order.quote.gasAmount * +order.quote.gasPrice / +order.quote.sellTokenPrice).toFixed(0)

    return (
        <div className="order-view-table">
            <div>
                <div>
                    <h3>Quote</h3>
                </div>
                <div>
                    <h3>Order</h3>
                </div>
            </div>
            <CompareItem label="Sell amount" quote={order.quote.sellAmount} order={order.sellAmount} token={sellToken}/>
            <CompareItem label="Buy amount" quote={order.quote.buyAmount} order={order.buyAmount} token={buyToken}/>
            <CompareItem label="Fee amount"
                         tooltipQuote="gasAmount * gasPrice / sellTokenPrice"
                         quote={quoteFee}
                         order={order.executedFee || null} token={sellToken}/>
        </div>
    )
}