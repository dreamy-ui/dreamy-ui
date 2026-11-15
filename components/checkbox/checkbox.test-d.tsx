import type { CheckedState } from "@ui-sdk/react/checkbox";
import { assertType } from "vitest";
import type { CheckboxGroupProps, CheckboxProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<CheckedState | undefined>({} as CheckboxProps["checked"]);
assertType<CheckedState | undefined>({} as CheckboxProps["defaultChecked"]);
assertType<((checked: CheckedState, details: never) => void) | undefined>(
    {} as CheckboxProps["onCheckedChange"]
);

assertType<boolean | undefined>({} as CheckboxProps["disabled"]);
assertType<boolean | undefined>({} as CheckboxProps["readOnly"]);
assertType<boolean | undefined>({} as CheckboxProps["required"]);
assertType<boolean | undefined>({} as CheckboxProps["isInvalid"]);

const _scheme: CheckboxProps["scheme"] = "primary";
const _size: CheckboxProps["size"] = "md";
const _variant: CheckboxProps["variant"] = "solid";

type _HasCallbackProps = ExpectTrue<
    "checked" extends keyof CheckboxProps
        ? "onCheckedChange" extends keyof CheckboxProps
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

type _HasGroupProps = ExpectTrue<
    "value" extends keyof CheckboxGroupProps
        ? "defaultValue" extends keyof CheckboxGroupProps
            ? "onValueChange" extends keyof CheckboxGroupProps
                ? true
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _groupProps: _HasGroupProps = true;

void (_callbackProps && _recipeProps && _styleProps && _groupProps);
void (_scheme && _size && _variant);

assertType<CheckboxProps>({
    children: "Accept terms",
    checked: true,
    defaultChecked: false,
    onCheckedChange: () => {},
    disabled: false,
    readOnly: false,
    required: false,
    isInvalid: false,
    variant: "solid",
    size: "md",
    scheme: "primary"
});

assertType<CheckboxGroupProps>({
    value: ["a"],
    defaultValue: [],
    onValueChange: () => {},
    disabled: false,
    readOnly: false,
    required: false,
    name: "terms",
    variant: "outline",
    size: "sm",
    scheme: "primary"
});
