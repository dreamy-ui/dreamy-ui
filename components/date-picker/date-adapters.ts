import { CalendarDate, type DateValue, getLocalTimeZone } from "@internationalized/date";

export interface DreamyDateRange {
    start: Date | null;
    end: Date | null;
}

export function jsDateToCalendarDate(date: Date): CalendarDate {
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function calendarDateToJsDate(value: DateValue): Date {
    return value.toDate(getLocalTimeZone());
}

export function jsDateToArkValue(date: Date | null | undefined): DateValue[] {
    if (!date) {
        return [];
    }
    return [jsDateToCalendarDate(date)];
}

export function arkValueToJsDate(values: DateValue[]): Date | null {
    if (!values[0]) {
        return null;
    }
    return calendarDateToJsDate(values[0]);
}

export function rangeToArkValue(range: DreamyDateRange | null | undefined): DateValue[] {
    if (!range) {
        return [];
    }

    const values: DateValue[] = [];
    if (range.start) {
        values.push(jsDateToCalendarDate(range.start));
    }
    if (range.end) {
        values.push(jsDateToCalendarDate(range.end));
    }
    return values;
}

export function arkValueToRange(values: DateValue[]): DreamyDateRange | null {
    if (!values.length) {
        return null;
    }

    return {
        start: values[0] ? calendarDateToJsDate(values[0]) : null,
        end: values[1] ? calendarDateToJsDate(values[1]) : null
    };
}

export function jsDateToArkMinMax(date: Date | undefined): CalendarDate | undefined {
    if (!date) {
        return undefined;
    }
    return jsDateToCalendarDate(date);
}
