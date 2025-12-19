import type { FullOrder } from "../types.ts";

const ONE_HUNDRED_BPS = (100 * 100)

export function getOrderBuyAmountAfterFees(order: FullOrder): bigint {
    const appData = JSON.parse(order.fullAppData || '{}')
    const slippagePercentBps: number = Math.round(appData?.metadata?.quote?.slippageBips ?? 0)
    const slippagePercent = slippagePercentBps > 0 ? slippagePercentBps / ONE_HUNDRED_BPS : 0

    return BigInt(Math.ceil(+order.buyAmount / (1 - slippagePercent)))
}