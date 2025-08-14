export function getAmountsDiffPercent(a: number, b: number | null): number | null {
    if (typeof b !== 'number') return null

    const bigger = Math.max(a, b)
    const smaller = Math.min(a, b)

    return Math.abs(smaller * 100 / bigger)
}