export type TimeField = "hour" | "minute" | "second" | "millisecond";

export type TimeSegment = TimeField | "period";

export type TimePeriod = "am" | "pm";

export interface TimeValue {
    /**
     * Hours in 24-hour format (0-23).
     */
    hours: number;
    /**
     * Minutes (0-59).
     */
    minutes: number;
    /**
     * Seconds (0-59).
     */
    seconds: number;
    /**
     * Milliseconds (0-999).
     */
    milliseconds: number;
}

export const DEFAULT_TIME_FIELDS: TimeField[] = ["hour", "minute"];

const FIELD_ORDER: TimeField[] = ["hour", "minute", "second", "millisecond"];

/**
 * Normalizes a fields array: unique values, kept in canonical time order.
 */
export function normalizeFields(fields: TimeField[] | undefined): TimeField[] {
    if (!fields || fields.length === 0) {
        return [...DEFAULT_TIME_FIELDS];
    }

    const unique = new Set<TimeField>();
    for (const field of fields) {
        if (FIELD_ORDER.includes(field)) {
            unique.add(field);
        }
    }

    if (unique.size === 0) {
        return [...DEFAULT_TIME_FIELDS];
    }

    return FIELD_ORDER.filter(function keepField(field) {
        return unique.has(field);
    });
}

/**
 * Parses a time string into a {@link TimeValue} using the active fields.
 *
 * Format examples:
 * - `["hour", "minute"]` → `"14:30"`
 * - `["hour", "minute", "second"]` → `"14:30:45"`
 * - `["hour", "minute", "second", "millisecond"]` → `"14:30:45.123"`
 * - `["second", "millisecond"]` → `"45.123"`
 * - `["minute", "second"]` → `"30:45"`
 */
export function parseTime(
    value: string | null | undefined,
    fields: TimeField[] = DEFAULT_TIME_FIELDS
): TimeValue | null {
    if (!value) {
        return null;
    }

    const activeFields = normalizeFields(fields);
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const parts = splitTimeParts(trimmed, activeFields);
    if (!parts) {
        return null;
    }

    const next: TimeValue = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    };

    for (let i = 0; i < activeFields.length; i++) {
        const field = activeFields[i];
        const part = parts[i];
        if (part === undefined || !/^\d+$/.test(part)) {
            return null;
        }

        const numeric = Number(part);
        if (!Number.isInteger(numeric) || !isValidFieldValue(field, numeric)) {
            return null;
        }

        setFieldValue(next, field, numeric);
    }

    return next;
}

/**
 * Formats a {@link TimeValue} for the active fields.
 */
export function formatTime(
    value: TimeValue,
    fields: TimeField[] = DEFAULT_TIME_FIELDS
): string {
    const activeFields = normalizeFields(fields);
    const parts: string[] = [];

    for (let i = 0; i < activeFields.length; i++) {
        const field = activeFields[i];
        const formatted = formatFieldValue(field, getFieldValue(value, field));

        if (i === 0) {
            parts.push(formatted);
            continue;
        }

        parts.push(getFieldSeparator(activeFields[i - 1], field) + formatted);
    }

    return parts.join("");
}

export function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

export function pad3(n: number): string {
    return String(n).padStart(3, "0");
}

/**
 * Returns the display hour for the given 24h hour.
 * 12h mode: 1-12. 24h mode: 0-23.
 */
export function getDisplayHour(hours: number, hour12: boolean): number {
    if (!hour12) {
        return hours;
    }

    const mod = hours % 12;
    return mod === 0 ? 12 : mod;
}

/**
 * Converts a display hour + period back to 24h hours.
 */
export function to24Hour(displayHour: number, period: TimePeriod, hour12: boolean): number {
    if (!hour12) {
        return clamp(displayHour, 0, 23);
    }

    const normalized = clamp(displayHour, 1, 12);
    if (period === "am") {
        return normalized === 12 ? 0 : normalized;
    }

    return normalized === 12 ? 12 : normalized + 12;
}

export function getPeriod(hours: number): TimePeriod {
    return hours >= 12 ? "pm" : "am";
}

export function getHourOptions(hour12: boolean): number[] {
    if (hour12) {
        return Array.from({ length: 12 }, (_, i) => i + 1);
    }

    return Array.from({ length: 24 }, (_, i) => i);
}

export function getMinuteOptions(step = 1): number[] {
    return getSteppedOptions(60, step, 30);
}

export function getSecondOptions(step = 1): number[] {
    return getSteppedOptions(60, step, 30);
}

export function getMillisecondOptions(step = 1): number[] {
    return getSteppedOptions(1000, step, 100);
}

export function snapMinute(minute: number, step = 1): number {
    return snapToOptions(minute, getMinuteOptions(step));
}

export function snapSecond(second: number, step = 1): number {
    return snapToOptions(second, getSecondOptions(step));
}

export function snapMillisecond(millisecond: number, step = 1): number {
    return snapToOptions(millisecond, getMillisecondOptions(step));
}

export function wrapIndex(index: number, length: number): number {
    if (length <= 0) {
        return 0;
    }

    return ((index % length) + length) % length;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Editable segments for the trigger, derived from fields + hour12.
 */
export function getSegments(fields: TimeField[], hour12: boolean): TimeSegment[] {
    const activeFields = normalizeFields(fields);
    const segments: TimeSegment[] = [...activeFields];

    if (hour12 && activeFields.includes("hour")) {
        segments.push("period");
    }

    return segments;
}

export function formatSegmentValue(
    segment: TimeSegment,
    time: TimeValue | null,
    hour12: boolean
): string {
    if (!time) {
        if (segment === "period") {
            return "AM";
        }
        if (segment === "millisecond") {
            return "---";
        }
        return "--";
    }

    if (segment === "hour") {
        return pad2(getDisplayHour(time.hours, hour12));
    }

    if (segment === "minute") {
        return pad2(time.minutes);
    }

    if (segment === "second") {
        return pad2(time.seconds);
    }

    if (segment === "millisecond") {
        return pad3(time.milliseconds);
    }

    return getPeriod(time.hours).toUpperCase();
}

/**
 * Separator rendered between two consecutive time fields in the trigger.
 */
export function getFieldSeparator(previous: TimeField, next: TimeField): string {
    if (next === "millisecond") {
        return ".";
    }

    void previous;
    return ":";
}

function getSteppedOptions(limit: number, step: number, maxStep: number): number[] {
    const safeStep = Math.max(1, Math.min(maxStep, Math.floor(step)));
    const options: number[] = [];

    for (let value = 0; value < limit; value += safeStep) {
        options.push(value);
    }

    return options;
}

function snapToOptions(value: number, options: number[]): number {
    let closest = options[0];
    let bestDistance = Math.abs(value - closest);

    for (const option of options) {
        const distance = Math.abs(value - option);
        if (distance < bestDistance) {
            closest = option;
            bestDistance = distance;
        }
    }

    return closest;
}

function isValidFieldValue(field: TimeField, value: number): boolean {
    if (field === "hour") {
        return value >= 0 && value <= 23;
    }
    if (field === "millisecond") {
        return value >= 0 && value <= 999;
    }
    return value >= 0 && value <= 59;
}

function getFieldValue(time: TimeValue, field: TimeField): number {
    if (field === "hour") {
        return time.hours;
    }
    if (field === "minute") {
        return time.minutes;
    }
    if (field === "second") {
        return time.seconds;
    }
    return time.milliseconds;
}

function setFieldValue(time: TimeValue, field: TimeField, value: number): void {
    if (field === "hour") {
        time.hours = value;
        return;
    }
    if (field === "minute") {
        time.minutes = value;
        return;
    }
    if (field === "second") {
        time.seconds = value;
        return;
    }
    time.milliseconds = value;
}

function formatFieldValue(field: TimeField, value: number): string {
    if (field === "millisecond") {
        return pad3(value);
    }
    return pad2(value);
}

function splitTimeParts(value: string, fields: TimeField[]): string[] | null {
    if (fields.length === 0) {
        return null;
    }

    const parts: string[] = [];
    let cursor = 0;

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const maxDigits = field === "millisecond" ? 3 : 2;
        const digits = readDigits(value, cursor, maxDigits);

        if (!digits) {
            return null;
        }

        parts.push(digits);
        cursor += digits.length;

        if (i === fields.length - 1) {
            break;
        }

        const separator = getFieldSeparator(field, fields[i + 1]);
        if (value.slice(cursor, cursor + separator.length) !== separator) {
            return null;
        }
        cursor += separator.length;
    }

    if (cursor !== value.length) {
        return null;
    }

    return parts;
}

function readDigits(value: string, start: number, maxDigits: number): string | null {
    let end = start;
    while (end < value.length && end - start < maxDigits && /\d/.test(value[end])) {
        end += 1;
    }

    if (end === start) {
        return null;
    }

    return value.slice(start, end);
}
