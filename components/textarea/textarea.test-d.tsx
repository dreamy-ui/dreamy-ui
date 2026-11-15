import { assertType } from "vitest";
import type { TextareaNoAutoSizeProps, TextareaProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: TextareaProps["size"] = "md";
const _variant: TextareaProps["variant"] = "outline";

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof TextareaProps
        ? "variant" extends keyof TextareaProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof TextareaProps
        ? "color" extends keyof TextareaProps
            ? "p" extends keyof TextareaProps
                ? "m" extends keyof TextareaProps
                    ? "w" extends keyof TextareaProps
                        ? "h" extends keyof TextareaProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _NoAutoSizeHasNativeApi = ExpectTrue<
    "onValueChange" extends keyof TextareaNoAutoSizeProps ? true : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _noAutoSize: _NoAutoSizeHasNativeApi = true;

void (_recipeProps && _styleProps && _noAutoSize && _size && _variant);

assertType<TextareaProps>({
    onChange: () => {},
    onValueChange: () => {},
    size: "md",
    variant: "filled",
    name: "bio",
    "aria-invalid": true,
    disabled: false,
    readOnly: false,
    required: false,
    minRows: 2,
    maxRows: 4,
    autoResize: true,
    className: "custom-textarea",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<TextareaNoAutoSizeProps>({
    onValueChange: () => {},
    size: "sm",
    variant: "outline"
});
