export interface DreamyDateRange {
    start: Date | null;
    end: Date | null;
}

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

export function jsDateToIsoDate(date: Date | null | undefined): string | null {
    if (!date || Number.isNaN(date.getTime())) {
        return null;
    }
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function isoDateToJsDate(iso: string | null | undefined): Date | null {
    if (!iso) {
        return null;
    }
    const parts = iso.split("-");
    if (parts.length !== 3) {
        return null;
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return null;
    }
    return new Date(year, month - 1, day);
}

export function rangeToIsoRange(
    range: DreamyDateRange | null | undefined
): [string, string] | null {
    if (!range?.start || !range?.end) {
        return null;
    }
    const start = jsDateToIsoDate(range.start);
    const end = jsDateToIsoDate(range.end);
    if (!start || !end) {
        return null;
    }
    return [start, end];
}

export function isoRangeToRange(
    iso: readonly [string, string] | null | undefined
): DreamyDateRange | null {
    if (!iso || iso.length < 2) {
        return null;
    }
    return {
        start: isoDateToJsDate(iso[0]),
        end: isoDateToJsDate(iso[1])
    };
}
