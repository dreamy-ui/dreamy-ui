import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { CheckboxGroupProps, CheckboxProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>({} as CheckboxProps["onChange"]);
assertType<((value: boolean) => void) | undefined>({} as CheckboxProps["onChangeValue"]);

assertType<boolean | undefined>({} as CheckboxProps["isChecked"]);
assertType<boolean | undefined>({} as CheckboxProps["defaultChecked"]);
assertType<boolean | undefined>({} as CheckboxProps["isIndeterminate"]);
assertType<boolean | undefined>({} as CheckboxProps["isDisabled"]);
assertType<boolean | undefined>({} as CheckboxProps["isRequired"]);
assertType<boolean | undefined>({} as CheckboxProps["isInvalid"]);
assertType<boolean | undefined>({} as CheckboxProps["isReadOnly"]);

const _scheme: CheckboxProps["scheme"] = "primary";
const _size: CheckboxProps["size"] = "md";
const _variant: CheckboxProps["variant"] = "solid";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof CheckboxProps
        ? "onChangeValue" extends keyof CheckboxProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof CheckboxProps
        ? "size" extends keyof CheckboxProps
            ? "variant" extends keyof CheckboxProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof CheckboxProps
        ? "color" extends keyof CheckboxProps
            ? "p" extends keyof CheckboxProps
                ? "m" extends keyof CheckboxProps
                    ? "w" extends keyof CheckboxProps
                        ? "h" extends keyof CheckboxProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasGroupCallbacks = ExpectTrue<"onChange" extends keyof CheckboxGroupProps ? true : false>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _groupCallbacks: _HasGroupCallbacks = true;

void (_callbackProps && _recipeProps && _styleProps && _groupCallbacks && _scheme && _size && _variant);

assertType<CheckboxProps>({
    onChange: () => {},
    onChangeValue: () => {},
    isChecked: true,
    defaultChecked: false,
    isIndeterminate: true,
    scheme: "primary",
    size: "md",
    variant: "outline",
    name: "terms",
    value: "accepted",
    className: "custom-checkbox",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<CheckboxGroupProps>({
    defaultValue: ["a"],
    onChange: () => {},
    scheme: "primary",
    size: "md",
    variant: "solid"
});

assertType<CheckboxProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<CheckboxProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<CheckboxProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
