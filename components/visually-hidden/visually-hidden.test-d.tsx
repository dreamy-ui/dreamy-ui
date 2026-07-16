import { assertType } from "vitest";
import type { VisuallyHiddenInputProps, VisuallyHiddenProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof VisuallyHiddenProps
        ? "color" extends keyof VisuallyHiddenProps
            ? "p" extends keyof VisuallyHiddenProps
                ? "m" extends keyof VisuallyHiddenProps
                    ? "w" extends keyof VisuallyHiddenProps
                        ? "h" extends keyof VisuallyHiddenProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasInputProps = ExpectTrue<
    "name" extends keyof VisuallyHiddenInputProps
        ? "value" extends keyof VisuallyHiddenInputProps
            ? "defaultValue" extends keyof VisuallyHiddenInputProps
                ? "type" extends keyof VisuallyHiddenInputProps
                    ? "readOnly" extends keyof VisuallyHiddenInputProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

const _styleProps: _HasStyleProps = true;
const _inputProps: _HasInputProps = true;

void (_styleProps && _inputProps);

assertType<VisuallyHiddenProps>({
    className: "custom-sr",
    id: "sr-label",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 0,
    w: "1px",
    h: "1px",
    children: "Close dialog"
});

assertType<VisuallyHiddenInputProps>({
    name: "token",
    value: "abc",
    defaultValue: "fallback",
    type: "hidden",
    readOnly: true,
    className: "custom-input",
    bg: "transparent",
    p: 0
});

assertType<VisuallyHiddenInputProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
