import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { CloseButtonProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string | undefined>({} as CloseButtonProps["aria-label"]);
assertType<boolean | undefined>({} as CloseButtonProps["isDisabled"]);
assertType<boolean | undefined>({} as CloseButtonProps["isLoading"]);
assertType<ReactNode | undefined>({} as CloseButtonProps["icon"]);

const _variant: CloseButtonProps["variant"] = "ghost";
const _size: CloseButtonProps["size"] = "sm";
const _scheme: CloseButtonProps["scheme"] = "error";

type _HasOptionalAriaLabel = ExpectTrue<
    "aria-label" extends keyof CloseButtonProps ? true : false
>;

type _HasRecipeProps = ExpectTrue<
    "variant" extends keyof CloseButtonProps
        ? "size" extends keyof CloseButtonProps
            ? "scheme" extends keyof CloseButtonProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof CloseButtonProps
        ? "color" extends keyof CloseButtonProps
            ? "p" extends keyof CloseButtonProps
                ? "m" extends keyof CloseButtonProps
                    ? "w" extends keyof CloseButtonProps
                        ? "h" extends keyof CloseButtonProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _optionalAriaLabel: _HasOptionalAriaLabel = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_optionalAriaLabel && _recipeProps && _styleProps && _variant && _size && _scheme);

assertType<CloseButtonProps>({
    "aria-label": "Close dialog",
    icon: null,
    isDisabled: false,
    variant: "ghost",
    size: "sm",
    scheme: "error",
    bg: "transparent",
    color: "fg",
    p: 1,
    m: 0,
    w: "auto",
    h: "auto"
});

assertType<CloseButtonProps>({
    // @ts-expect-error invalid variant
    variant: "invalid"
});

assertType<CloseButtonProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<CloseButtonProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});
