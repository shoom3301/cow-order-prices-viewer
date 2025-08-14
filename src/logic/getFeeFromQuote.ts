import type { QuoteData } from "../types.ts";

export function getFeeFromQuote(quote: QuoteData): bigint {
    const value = +quote.gasAmount * +quote.gasPrice / +quote.sellTokenPrice

    try {
        return BigInt(value)
    } catch {
        return BigInt(value.toFixed(0))
    }
}