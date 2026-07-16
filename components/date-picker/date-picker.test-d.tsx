import { assertType } from "vitest";
import type { DatePickerRootProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<Date | null | undefined>({} as DatePickerRootProps["value"]);
assertType<Date | null | undefined>({} as DatePickerRootProps["defaultValue"]);
assertType<((date: Date | null) => void) | undefined>({} as DatePickerRootProps["onChange"]);
assertType<string | undefined>({} as DatePickerRootProps["dateFormat"]);
assertType<string | undefined>({} as DatePickerRootProps["placeholder"]);
assertType<Date | undefined>({} as DatePickerRootProps["minDate"]);
assertType<Date | undefined>({} as DatePickerRootProps["maxDate"]);
assertType<0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined>({} as DatePickerRootProps["weekStartsOn"]);

const _size: DatePickerRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof DatePickerRootProps
        ? "onChange" extends keyof DatePickerRootProps
            ? "minDate" extends keyof DatePickerRootProps
                ? "maxDate" extends keyof DatePickerRootProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof DatePickerRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof DatePickerRootProps
        ? "color" extends keyof DatePickerRootProps
            ? "p" extends keyof DatePickerRootProps
                ? "m" extends keyof DatePickerRootProps
                    ? "w" extends keyof DatePickerRootProps
                        ? "h" extends keyof DatePickerRootProps
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

assertType<DatePickerRootProps>({
    value: new Date(2026, 0, 1),
    defaultValue: null,
    onChange: () => {},
    dateFormat: "MMM D, YYYY",
    placeholder: "Select date",
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 0, 1),
    weekStartsOn: 1,
    size: "md",
    popoverProps: { usePortal: false },
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<DatePickerRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<DatePickerRootProps>({
    // @ts-expect-error weekStartsOn must be 0-6
    weekStartsOn: 7
});

assertType<DatePickerRootProps>({
    // @ts-expect-error onChange receives Date | null, not a string
    onChange: (_value: string) => {}
});
