import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { SelectProps, SelectTriggerProps } from "./index";

type ExpectTrue<T extends true> = T;

type SingleSelectProps = SelectProps<false>;

assertType<ChangeEventHandler<HTMLSelectElement> | undefined>({} as SingleSelectProps["onChange"]);
assertType<((value: string) => void) | undefined>({} as SingleSelectProps["onChangeValue"]);
assertType<string | undefined>({} as SingleSelectProps["value"]);
assertType<string | undefined>({} as SingleSelectProps["defaultValue"]);
assertType<boolean | undefined>({} as SingleSelectProps["isDisabled"]);
assertType<boolean | undefined>({} as SingleSelectProps["isInvalid"]);
assertType<boolean | undefined>({} as SingleSelectProps["isRequired"]);
assertType<boolean | undefined>({} as SingleSelectProps["isClearable"]);
assertType<boolean | undefined>({} as SingleSelectProps["isMultiple"]);

assertType<string | undefined>({} as SelectTriggerProps["placeholder"]);

const _size: SingleSelectProps["size"] = "md";
const _variant: SingleSelectProps["variant"] = "plain";
const _triggerVariant: SingleSelectProps["triggerVariant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof SingleSelectProps
        ? "onChangeValue" extends keyof SingleSelectProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof SingleSelectProps
        ? "variant" extends keyof SingleSelectProps
            ? "triggerVariant" extends keyof SingleSelectProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SingleSelectProps
        ? "color" extends keyof SingleSelectProps
            ? "p" extends keyof SingleSelectProps
                ? "m" extends keyof SingleSelectProps
                    ? "w" extends keyof SingleSelectProps
                        ? "h" extends keyof SingleSelectProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<"placeholder" extends keyof SelectTriggerProps ? true : false>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (
    _callbackProps &&
    _recipeProps &&
    _styleProps &&
    _partProps &&
    _size &&
    _variant &&
    _triggerVariant
);

assertType<SingleSelectProps>({
    items: [{ value: "a", label: "A" }],
    onChange: () => {},
    onChangeValue: () => {},
    value: "a",
    defaultValue: "a",
    size: "md",
    variant: "plain",
    triggerVariant: "outline",
    isClearable: true,
    name: "fruit",
    className: "custom-select",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "xs",
    h: "auto"
});

assertType<SingleSelectProps["onChangeValue"]>(
    // @ts-expect-error onChangeValue receives the selected value, not an event
    (_event: ChangeEventHandler<HTMLSelectElement>) => {}
);

assertType<SingleSelectProps>({
    items: [{ value: "a", label: "A" }],
    // @ts-expect-error invalid size
    size: "xxl"
});

assertType<SingleSelectProps>({
    items: [{ value: "a", label: "A" }],
    // @ts-expect-error invalid variant
    variant: "ghost"
});
