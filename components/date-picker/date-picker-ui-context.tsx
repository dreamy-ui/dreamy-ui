"use client";

import { createContext } from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import type {
    CalendarController,
    CalendarFocusedChangeReason,
    CalendarMonthChangeReason,
    DateMatchers,
    ISOMonth
} from "@ui-sdk/react/calendar";
import type { DatePickerVariantProps } from "styled-system/recipes";

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DatePickerUiContextValue {
    id: string;
    value: Date | null;
    setValue: (next: Date | null) => void;
    dateFormat: string;
    placeholder: string;
    size?: DatePickerVariantProps["size"];
    minDate?: Date;
    maxDate?: Date;
    weekStartsOn: WeekStartsOn;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    invalid?: boolean;
    hasFooter: boolean;
    setHasFooter: React.Dispatch<React.SetStateAction<boolean>>;
    closeOnSelect?: boolean;
    onApply?: () => void;
    onCancel?: () => void;
    focusCalendar: () => void;
    closePopover: () => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    container?: DocumentFragment | Element | null;
    month?: ISOMonth;
    defaultMonth?: ISOMonth;
    onMonthChange?: (month: ISOMonth, details: ChangeDetails<CalendarMonthChangeReason>) => void;
    unavailable?: DateMatchers;
    deselectable?: boolean;
    onFocusedChange?: (date: string, details: ChangeDetails<CalendarFocusedChangeReason>) => void;
    months?: number;
    pageBy?: "month" | "page";
    locale?: string;
    weekdayFormat?: "narrow" | "short" | "long";
    monthFormat?: "narrow" | "short" | "long";
    fixedWeeks?: boolean;
    showOutsideDays?: boolean;
    today?: string;
    timeZone?: string;
    controller?: CalendarController;
    debug?: boolean;
}

export const [DatePickerUiProvider, useDatePickerUi] = createContext<DatePickerUiContextValue>({
    strict: true,
    name: "DatePickerUiContext"
});
