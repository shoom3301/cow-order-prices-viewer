export function stringifyWithBigInt(obj: any, space?: number): string {
    return JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    , space);
}