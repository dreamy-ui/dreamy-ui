import { assertType } from "vitest";
import type { DateRangePickerRootProps } from "./index";

type ExpectTrue<T extends true> = T;

interface DateRange {
    start: Date | null;
    end: Date | null;
}

assertType<DateRange | null | undefined>({} as DateRangePickerRootProps["value"]);
assertType<DateRange | null | undefined>({} as DateRangePickerRootProps["defaultValue"]);
assertType<((range: DateRange | null) => void) | undefined>(
    {} as DateRangePickerRootProps["onChange"]
);
assertType<string | undefined>({} as DateRangePickerRootProps["dateFormat"]);
assertType<string | undefined>({} as DateRangePickerRootProps["placeholder"]);
assertType<Date | undefined>({} as DateRangePickerRootProps["minDate"]);
assertType<Date | undefined>({} as DateRangePickerRootProps["maxDate"]);
assertType<boolean | undefined>({} as DateRangePickerRootProps["showFooter"]);

const _size: DateRangePickerRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof DateRangePickerRootProps
        ? "onChange" extends keyof DateRangePickerRootProps
            ? "showFooter" extends keyof DateRangePickerRootProps
                ? "presets" extends keyof DateRangePickerRootProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof DateRangePickerRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof DateRangePickerRootProps
        ? "color" extends keyof DateRangePickerRootProps
            ? "p" extends keyof DateRangePickerRootProps
                ? "m" extends keyof DateRangePickerRootProps
                    ? "w" extends keyof DateRangePickerRootProps
                        ? "h" extends keyof DateRangePickerRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _valueProps: _HasValueProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_valueProps && _recipeProps && _styleProps && _size);

assertType<DateRangePickerRootProps>({
    value: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 7) },
    defaultValue: null,
    onChange: () => {},
    dateFormat: "MMM D, YYYY",
    placeholder: "Select date range",
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 0, 1),
    showFooter: true,
    size: "md",
    popoverProps: { usePortal: false },
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<DateRangePickerRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<DateRangePickerRootProps>({
    // @ts-expect-error showFooter must be boolean
    showFooter: "yes"
});

assertType<DateRangePickerRootProps>({
    // @ts-expect-error onChange receives a range, not a single Date
    onChange: (_value: Date) => {}
});
