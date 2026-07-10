export function formatCompactCount(count: number): string {
    if (count >= 1_000_000) {
        const value = count / 1_000_000;
        return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
    }

    if (count >= 10_000) {
        const value = count / 1_000;
        return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
    }

    if (count >= 1_000) {
        const value = count / 1_000;
        return `${value.toFixed(1)}k`;
    }

    return count.toLocaleString("en-US");
}
