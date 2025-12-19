import type { FullOrder } from "../types.ts";

const ONE_HUNDRED_BPS = (100 * 100)

export function getOrderBuyAmountAfterFees(order: FullOrder): bigint {
    return getOrderAmountAfterFees(order, order.buyAmount)
}

export function getOrderSellAmountAfterFees(order: FullOrder): bigint {
    return getOrderAmountAfterFees(order, order.sellAmount)
}

function getOrderAmountAfterFees(order: FullOrder, amount: string): bigint {
    const appData = JSON.parse(order.fullAppData || '{}')
    const slippagePercentBps: number = Math.round(appData?.metadata?.quote?.slippageBips ?? 0)
    const slippagePercent = slippagePercentBps > 0 ? slippagePercentBps / ONE_HUNDRED_BPS : 0

    return BigInt(Math.ceil(+amount / (1 - slippagePercent)))
}