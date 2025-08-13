const OX = '0x'
const ORDER_ID_LENGTH = 112

export function parseOrderIdFromInput(_input: string): string | null {
    const input = _input.trim()

    if (input.startsWith(OX) && input.length === OX.length + ORDER_ID_LENGTH) {
        return input
    }

    if (input.startsWith('http')) {
        const parts = input.split('/')

        return parseOrderIdFromInput(parts[parts.length - 1])
    }

    return null
}