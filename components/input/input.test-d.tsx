import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { InputGroupProps, InputProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>({} as InputProps["onChange"]);
assertType<((value: string) => void) | undefined>({} as InputProps["onChangeValue"]);
assertType<boolean | undefined>({} as InputProps["isDisabled"]);
assertType<boolean | undefined>({} as InputProps["isInvalid"]);
assertType<boolean | undefined>({} as InputProps["isRequired"]);
assertType<boolean | undefined>({} as InputProps["isReadOnly"]);

const _size: InputProps["size"] = "md";
const _variant: InputProps["variant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof InputProps
        ? "onChangeValue" extends keyof InputProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof InputProps ? ("variant" extends keyof InputProps ? true : false) : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof InputProps
        ? "color" extends keyof InputProps
            ? "p" extends keyof InputProps
                ? "m" extends keyof InputProps
                    ? "w" extends keyof InputProps
                        ? "h" extends keyof InputProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasGroupParts = ExpectTrue<"children" extends keyof InputGroupProps ? true : false>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _groupParts: _HasGroupParts = true;

void (_callbackProps && _recipeProps && _styleProps && _groupParts && _size && _variant);

assertType<InputProps>({
    onChange: () => {},
    onChangeValue: () => {},
    size: "md",
    variant: "filled",
    name: "email",
    type: "email",
    autoComplete: "email",
    isInvalid: true,
    className: "custom-input",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<InputProps["onChange"]>(
    // @ts-expect-error onChange must receive a change event, not a string
    (_value: string) => {}
);

assertType<InputProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<InputProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
