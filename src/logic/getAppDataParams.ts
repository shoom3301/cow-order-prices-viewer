import type { FullOrder } from "../types.ts";

export function getAppDataParams(order: FullOrder): { partnerFeeBps: number, slippagePercentBps: number } {
    const appData = JSON.parse(order.fullAppData || '{}')

    const partnerFeeBps = appData?.metadata?.partnerFee?.volumeBps ?? 0
    const slippagePercentBps: number = appData?.metadata?.quote?.slippageBips ?? 0

    return {
        partnerFeeBps,
        slippagePercentBps
    }
}