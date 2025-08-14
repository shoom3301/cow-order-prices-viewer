import { getFeeFromQuote } from "./getFeeFromQuote.ts";
import { getQuoteAmountsAndCosts, type TokenInfo, type QuoteAmountsAndCosts } from "@cowprotocol/cow-sdk";
import type { FullOrder } from "../types.ts";
import { getAppDataParams } from "./getAppDataParams.ts";

export function getQuoteAmounts(order: FullOrder, sellToken: TokenInfo, buyToken: TokenInfo): QuoteAmountsAndCosts {
    const {partnerFeeBps, slippagePercentBps} = getAppDataParams(order)

    const quoteFeeInSellToken = getFeeFromQuote(order.quote)
    const quoteBuyAmount = BigInt(order.quote.buyAmount)
    const quoteSellAmount = BigInt(order.quote.sellAmount)
    const limitPrice= Number(quoteBuyAmount) / Number(quoteSellAmount)
    const quoteFeeInBuyToken = BigInt(Math.ceil(Number(quoteFeeInSellToken) * limitPrice))

    return getQuoteAmountsAndCosts({
        orderParams: {
            ...order,
            sellAmount: (quoteSellAmount - quoteFeeInSellToken).toString(),
            buyAmount: (quoteBuyAmount - quoteFeeInBuyToken).toString(),
            feeAmount: quoteFeeInSellToken.toString()
        },
        sellDecimals: sellToken.decimals,
        buyDecimals: buyToken.decimals,
        slippagePercentBps,
        partnerFeeBps
    })
}