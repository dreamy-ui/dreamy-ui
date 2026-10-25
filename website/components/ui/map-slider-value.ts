export function toSliderValue(value?: number | number[]): number[] | undefined {
    if (value === undefined) {
        return undefined;
    }
    return Array.isArray(value) ? value : [value];
}

export function fromSliderValue(value: number[]): number {
    return value[0] ?? 0;
}
