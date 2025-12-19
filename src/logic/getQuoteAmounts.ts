import { getFeeFromQuote } from "./getFeeFromQuote.ts";
import { getQuoteAmountsAndCosts, type QuoteAmountsAndCosts, type TokenInfo } from "@cowprotocol/cow-sdk";
import type { FullOrder } from "../types.ts";
import { getAppDataParams } from "./getAppDataParams.ts";
import type { QuoteAmountsAndCostsParams } from "@cowprotocol/sdk-order-book";

const protocolFeeBps = 2

export function getQuoteAmounts(order: FullOrder, sellToken: TokenInfo, buyToken: TokenInfo): {
    result: QuoteAmountsAndCosts,
    params: QuoteAmountsAndCostsParams
} {
    const {partnerFeeBps, slippagePercentBps} = getAppDataParams(order)

    const quoteFeeInSellToken = getFeeFromQuote(order.quote)
    const quoteBuyAmount = BigInt(order.quote.buyAmount)
    const quoteSellAmount = BigInt(order.quote.sellAmount)
    // const limitPrice= Number(quoteBuyAmount) / Number(quoteSellAmount)
    // const quoteFeeInBuyToken = BigInt(Math.ceil(Number(quoteFeeInSellToken) * limitPrice))

    const sellAmount = (quoteSellAmount - quoteFeeInSellToken)
    const buyAmount = quoteBuyAmount

    const params: QuoteAmountsAndCostsParams = {
        protocolFeeBps,
        orderParams: {
            ...order,
            sellAmount: sellAmount.toString(),
            buyAmount: buyAmount.toString(),
            feeAmount: quoteFeeInSellToken.toString()
        },
        sellDecimals: sellToken.decimals,
        buyDecimals: buyToken.decimals,
        slippagePercentBps,
        partnerFeeBps
    }

    const result = getQuoteAmountsAndCosts({
        protocolFeeBps,
        orderParams: {
            ...order,
            sellAmount: sellAmount.toString(),
            buyAmount: buyAmount.toString(),
            feeAmount: quoteFeeInSellToken.toString()
        },
        sellDecimals: sellToken.decimals,
        buyDecimals: buyToken.decimals,
        slippagePercentBps,
        partnerFeeBps
    })

    console.log('getQuoteAmounts', {
        result,
        data: {
            order,
            protocolFeeBps,
            sellAmount,
            buyAmount,
            quoteFeeInSellToken,
            sellToken,
            buyToken,
            slippagePercentBps,
            partnerFeeBps,
        },
        getQuoteAmountsAndCosts
    })

    return {params, result}
}