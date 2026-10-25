"use client";

import { createContext } from "@dreamy-ui/react";
import type { DatePickerVariantProps } from "styled-system/recipes";

export interface DatePickerUiContextValue {
    id: string;
    value: Date | null;
    setValue: React.Dispatch<React.SetStateAction<Date | null>>;
    dateFormat: string;
    placeholder: string;
    size?: DatePickerVariantProps["size"];
    minDate?: Date;
    maxDate?: Date;
    hasFooter: boolean;
    setHasFooter: React.Dispatch<React.SetStateAction<boolean>>;
    onApply?: () => void;
    onCancel?: () => void;
    focusCalendar: () => void;
}

export const [DatePickerUiProvider, useDatePickerUi] = createContext<DatePickerUiContextValue>({
    strict: true,
    name: "DatePickerUiContext"
});
