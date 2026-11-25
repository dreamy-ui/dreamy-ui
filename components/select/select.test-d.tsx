import type { ChangeDetails } from "@ui-sdk/core";
import type { SelectValueChangeReason } from "@ui-sdk/react/select";
import { assertType } from "vitest";
import type { SelectProps, SelectTriggerProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

type SingleSelectProps = SelectProps<false>;
type MultiSelectProps = SelectProps<true>;

assertType<
    ((value: string | null, details: ChangeDetails<SelectValueChangeReason>) => void) | undefined
>({} as SingleSelectProps["onValueChange"]);
assertType<string | null | undefined>({} as SingleSelectProps["value"]);
assertType<string | null | undefined>({} as SingleSelectProps["defaultValue"]);
assertType<string[] | undefined>({} as MultiSelectProps["value"]);
assertType<string[] | undefined>({} as MultiSelectProps["defaultValue"]);
assertType<boolean | undefined>({} as SingleSelectProps["disabled"]);
assertType<boolean | undefined>({} as SingleSelectProps["readOnly"]);
assertType<boolean | undefined>({} as SingleSelectProps["invalid"]);
assertType<boolean | undefined>({} as SingleSelectProps["required"]);
assertType<boolean | undefined>({} as SingleSelectProps["clearable"]);
assertType<false | undefined>({} as SingleSelectProps["multiple"]);

assertType<string | undefined>({} as SelectTriggerProps["placeholder"]);

const _size: SingleSelectProps["size"] = "md";
const _variant: SingleSelectProps["variant"] = "plain";
const _triggerVariant: SingleSelectProps["triggerVariant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onValueChange" extends KnownKeys<SingleSelectProps>
        ? "onOpenChange" extends KnownKeys<SingleSelectProps>
            ? true
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChangeValue" extends KnownKeys<SingleSelectProps>
        ? false
        : "isMultiple" extends KnownKeys<SingleSelectProps>
          ? false
          : "isClearable" extends KnownKeys<SingleSelectProps>
            ? false
            : "isDisabled" extends KnownKeys<SingleSelectProps>
              ? false
              : "popoverProps" extends KnownKeys<SingleSelectProps>
                ? false
                : true
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends KnownKeys<SingleSelectProps>
        ? "variant" extends KnownKeys<SingleSelectProps>
            ? "triggerVariant" extends KnownKeys<SingleSelectProps>
                ? true
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "placeholder" extends KnownKeys<SelectTriggerProps> ? true : false
>;

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _partProps: _HasPartProps = true;

void (
    _callbackProps &&
    _noLegacyProps &&
    _recipeProps &&
    _partProps &&
    _size &&
    _variant &&
    _triggerVariant
);

assertType<SingleSelectProps>({
    items: [{ value: "a", label: "A" }],
    onValueChange: () => {},
    value: "a",
    defaultValue: "a",
    size: "md",
    variant: "plain",
    triggerVariant: "outline",
    clearable: true,
    name: "fruit",
    className: "custom-select",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "xs",
    h: "auto"
});

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
