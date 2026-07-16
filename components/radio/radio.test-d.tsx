import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { RadioGroupProps, RadioProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>({} as RadioProps["onChange"]);
assertType<string | number | undefined>({} as RadioProps["value"]);
assertType<boolean | undefined>({} as RadioProps["isChecked"]);
assertType<boolean | undefined>({} as RadioProps["defaultChecked"]);
assertType<boolean | undefined>({} as RadioProps["isDisabled"]);
assertType<boolean | undefined>({} as RadioProps["isInvalid"]);
assertType<boolean | undefined>({} as RadioProps["isRequired"]);
assertType<boolean | undefined>({} as RadioProps["isReadOnly"]);

const _scheme: RadioProps["scheme"] = "primary";
const _size: RadioProps["size"] = "md";
const _variant: RadioProps["variant"] = "solid";

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof RadioProps
        ? "size" extends keyof RadioProps
            ? "variant" extends keyof RadioProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof RadioProps
        ? "color" extends keyof RadioProps
            ? "p" extends keyof RadioProps
                ? "m" extends keyof RadioProps
                    ? "w" extends keyof RadioProps
                        ? "h" extends keyof RadioProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasGroupProps = ExpectTrue<
    "value" extends keyof RadioGroupProps
        ? "defaultValue" extends keyof RadioGroupProps
            ? "onChange" extends keyof RadioGroupProps
                ? true
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _groupProps: _HasGroupProps = true;

void (_recipeProps && _styleProps && _groupProps && _scheme && _size && _variant);

assertType<RadioProps>({
    onChange: () => {},
    value: "pro",
    isChecked: true,
    defaultChecked: false,
    scheme: "primary",
    size: "md",
    variant: "solid",
    name: "plan",
    className: "custom-radio",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<RadioGroupProps>({
    value: "pro",
    defaultValue: "team",
    onChange: () => {},
    scheme: "primary",
    size: "md",
    variant: "solid",
    isDisabled: false,
    isInvalid: false
});

assertType<RadioProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<RadioProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<RadioProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
