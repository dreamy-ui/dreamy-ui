"use client";

import { createContext } from "@dreamy-ui/react";
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
    hasFooter: boolean;
    setHasFooter: React.Dispatch<React.SetStateAction<boolean>>;
    onApply?: () => void;
    onCancel?: () => void;
    focusCalendar: () => void;
    closePopover: () => void;
}

export const [DatePickerUiProvider, useDatePickerUi] = createContext<DatePickerUiContextValue>({
    strict: true,
    name: "DatePickerUiContext"
});
