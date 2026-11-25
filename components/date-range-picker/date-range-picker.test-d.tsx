import { assertType } from "vitest";
import type { DateRangePickerRootProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

interface DateRange {
    start: Date | null;
    end: Date | null;
}

assertType<DateRange | null | undefined>({} as DateRangePickerRootProps["value"]);
assertType<DateRange | null | undefined>({} as DateRangePickerRootProps["defaultValue"]);
assertType<((range: DateRange | null) => void) | undefined>(
    {} as DateRangePickerRootProps["onValueChange"]
);
assertType<string | undefined>({} as DateRangePickerRootProps["dateFormat"]);
assertType<string | undefined>({} as DateRangePickerRootProps["placeholder"]);
assertType<Date | undefined>({} as DateRangePickerRootProps["minDate"]);
assertType<Date | undefined>({} as DateRangePickerRootProps["maxDate"]);
assertType<boolean | undefined>({} as DateRangePickerRootProps["showFooter"]);

const _size: DateRangePickerRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends KnownKeys<DateRangePickerRootProps>
        ? "onValueChange" extends KnownKeys<DateRangePickerRootProps>
            ? "showFooter" extends KnownKeys<DateRangePickerRootProps>
                ? "presets" extends KnownKeys<DateRangePickerRootProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChange" extends KnownKeys<DateRangePickerRootProps>
        ? false
        : "popoverProps" extends KnownKeys<DateRangePickerRootProps>
          ? false
          : true
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends KnownKeys<DateRangePickerRootProps> ? true : false
>;

const _valueProps: _HasValueProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;

void (_valueProps && _noLegacyProps && _recipeProps && _size);

assertType<DateRangePickerRootProps>({
    value: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 7) },
    defaultValue: null,
    onValueChange: () => {},
    open: true,
    onOpenChange: () => {},
    dateFormat: "MMM D, YYYY",
    placeholder: "Select date range",
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 0, 1),
    showFooter: true,
    size: "md",
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
    // @ts-expect-error onValueChange receives a range, not a single Date
    onValueChange: (_value: Date) => {}
});
