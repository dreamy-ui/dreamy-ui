import type { DateMatcher, DateMatchers } from "@ui-sdk/react/calendar";
import dayjs from "dayjs";

export interface DreamyDateRange {
    start: Date | null;
    end: Date | null;
}

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function matchesSingleMatcher(iso: string, matcher: DateMatcher): boolean {
    if (typeof matcher === "string") {
        return iso === matcher;
    }
    if (typeof matcher === "function") {
        return matcher(iso);
    }
    if ("from" in matcher) {
        return iso >= matcher.from && iso <= matcher.to;
    }
    if ("weekday" in matcher) {
        const parsed = isoDateToJsDate(iso);
        return parsed ? matcher.weekday.includes(parsed.getDay()) : false;
    }
    if ("before" in matcher) {
        return iso < matcher.before;
    }
    return iso > matcher.after;
}

export function matchesDateMatchers(
    iso: string | null | undefined,
    matchers: DateMatchers | null | undefined
): boolean {
    if (!iso || !matchers) {
        return false;
    }
    const list = Array.isArray(matchers) ? matchers : [matchers];
    return list.some((matcher) => matchesSingleMatcher(iso, matcher));
}

export function isPresetDateAllowed(
    date: Date | null | undefined,
    options: {
        minDate?: Date;
        maxDate?: Date;
        unavailable?: DateMatchers;
    }
): boolean {
    if (!date) return false;
    const d = dayjs(date);
    if (!d.isValid()) return false;
    if (options.minDate && d.isBefore(dayjs(options.minDate), "day")) return false;
    if (options.maxDate && d.isAfter(dayjs(options.maxDate), "day")) return false;
    const iso = jsDateToIsoDate(date);
    if (matchesDateMatchers(iso, options.unavailable)) return false;
    return true;
}

export function isPresetRangeAllowed(
    range: DreamyDateRange | null | undefined,
    options: {
        minDate?: Date;
        maxDate?: Date;
        minDays?: number;
        maxDays?: number;
        unavailable?: DateMatchers;
        allowUnavailable?: boolean;
    }
): boolean {
    if (!range?.start || !range?.end) return false;
    const start = dayjs(range.start).startOf("day");
    const end = dayjs(range.end).startOf("day");
    if (!start.isValid() || !end.isValid() || end.isBefore(start, "day")) return false;

    if (!isPresetDateAllowed(range.start, options) || !isPresetDateAllowed(range.end, options)) {
        return false;
    }

    const days = end.diff(start, "day") + 1;
    if (options.minDays !== undefined && days < options.minDays) return false;
    if (options.maxDays !== undefined && days > options.maxDays) return false;

    if (options.unavailable && !options.allowUnavailable) {
        for (let cursor = start; !cursor.isAfter(end, "day"); cursor = cursor.add(1, "day")) {
            const iso = jsDateToIsoDate(cursor.toDate());
            if (matchesDateMatchers(iso, options.unavailable)) {
                return false;
            }
        }
    }

    return true;
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
