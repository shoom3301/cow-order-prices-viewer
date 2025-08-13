export function firstDiffIndex(str1: string, str2: string): number {
    const minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
            return i;
        }
    }

    // If one string is a prefix of the other, return the shorter length
    if (str1.length !== str2.length) {
        return minLength;
    }

    // Strings are identical
    return -1;
}