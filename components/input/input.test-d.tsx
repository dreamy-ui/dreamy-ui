import { assertType } from "vitest";
import type { InputGroupProps, InputProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: InputProps["size"] = "md";
const _variant: InputProps["variant"] = "outline";

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

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _groupParts: _HasGroupParts = true;

void (_recipeProps && _styleProps && _groupParts && _size && _variant);

assertType<InputProps>({
    onChange: () => {},
    onValueChange: () => {},
    size: "md",
    variant: "filled",
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": true,
    disabled: false,
    readOnly: false,
    required: false,
    className: "custom-input",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});
