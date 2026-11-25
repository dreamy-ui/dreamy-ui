import { assertType } from "vitest";
import type {
    DatePickerAIOProps,
    DatePickerContentProps,
    DatePickerInputProps,
    DatePickerRootProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<Date | null | undefined>({} as DatePickerRootProps["value"]);
assertType<Date | null | undefined>({} as DatePickerRootProps["defaultValue"]);
assertType<((date: Date | null) => void) | undefined>({} as DatePickerRootProps["onValueChange"]);
assertType<string | undefined>({} as DatePickerRootProps["dateFormat"]);
assertType<string | undefined>({} as DatePickerRootProps["placeholder"]);
assertType<Date | undefined>({} as DatePickerRootProps["minDate"]);
assertType<Date | undefined>({} as DatePickerRootProps["maxDate"]);
assertType<0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined>({} as DatePickerRootProps["weekStartsOn"]);

const _size: DatePickerRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends KnownKeys<DatePickerRootProps>
        ? "onValueChange" extends KnownKeys<DatePickerRootProps>
            ? "open" extends KnownKeys<DatePickerRootProps>
                ? "onOpenChange" extends KnownKeys<DatePickerRootProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChange" extends KnownKeys<DatePickerRootProps>
        ? false
        : "popoverProps" extends KnownKeys<DatePickerRootProps>
          ? false
          : true
>;

type _HasRecipeProps = ExpectTrue<"size" extends KnownKeys<DatePickerRootProps> ? true : false>;

type _HasInputGroupProps = ExpectTrue<
    "inputGroupProps" extends KnownKeys<DatePickerInputProps>
        ? "endAddonProps" extends KnownKeys<DatePickerInputProps>
            ? true
            : false
        : false
>;

type _HasContentProps = ExpectTrue<
    "children" extends KnownKeys<DatePickerContentProps> ? true : false
>;

type _HasAIOContentProps = ExpectTrue<
    "contentProps" extends KnownKeys<DatePickerAIOProps> ? true : false
>;

const _valueProps: _HasValueProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _inputGroupProps: _HasInputGroupProps = true;
const _contentProps: _HasContentProps = true;
const _aioContentProps: _HasAIOContentProps = true;

void (
    _valueProps &&
    _noLegacyProps &&
    _recipeProps &&
    _size &&
    _inputGroupProps &&
    _contentProps &&
    _aioContentProps
);

assertType<DatePickerRootProps>({
    value: new Date(2026, 0, 1),
    defaultValue: null,
    onValueChange: () => {},
    open: true,
    onOpenChange: () => {},
    dateFormat: "MMM D, YYYY",
    placeholder: "Select date",
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 0, 1),
    weekStartsOn: 1,
    size: "md",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<DatePickerInputProps>({
    placeholder: "Pick a date",
    inputGroupProps: { w: "full" },
    endAddonProps: { "aria-hidden": true }
});

assertType<DatePickerAIOProps>({
    contentProps: {},
    inputProps: {
        inputGroupProps: { w: "full" }
    }
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
    // @ts-expect-error onValueChange receives Date | null, not a string
    onValueChange: (_value: string) => {}
});
