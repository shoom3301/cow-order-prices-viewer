// It's important to use regular number here in order to no loose precision
export function getAmountBasedSlippage(afterFeesAmount: bigint, afterSlippageAmount: bigint): number {
    return 100 - (+afterSlippageAmount.toString() * 100 / +afterFeesAmount.toString())
}