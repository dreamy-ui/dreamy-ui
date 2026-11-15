import { assertType } from "vitest";
import type { RadioGroupProps, RadioProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string>({} as RadioProps["value"]);
assertType<boolean | undefined>({} as RadioProps["checked"]);
assertType<boolean | undefined>({} as RadioProps["defaultChecked"]);
assertType<((checked: boolean, details: never) => void) | undefined>(
    {} as RadioProps["onCheckedChange"]
);
assertType<boolean | undefined>({} as RadioProps["disabled"]);
assertType<boolean | undefined>({} as RadioProps["readOnly"]);
assertType<boolean | undefined>({} as RadioProps["required"]);
assertType<string | undefined>({} as RadioProps["name"]);

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
            ? "onValueChange" extends keyof RadioGroupProps
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
    value: "a",
    checked: true,
    defaultChecked: false,
    onCheckedChange: () => {},
    disabled: false,
    readOnly: false,
    required: false,
    name: "choice",
    variant: "solid",
    size: "md",
    scheme: "primary"
});

assertType<RadioGroupProps>({
    value: "a",
    defaultValue: null,
    onValueChange: () => {},
    disabled: false,
    readOnly: false,
    required: false,
    name: "choice",
    loop: true,
    variant: "solid",
    size: "sm",
    scheme: "primary"
});
