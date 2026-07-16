import type { MouseEventHandler, ReactNode } from "react";
import { assertType } from "vitest";
import type { ButtonProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<MouseEventHandler<HTMLButtonElement> | undefined>({} as ButtonProps["onClick"]);
assertType<boolean | undefined>({} as ButtonProps["isDisabled"]);
assertType<boolean | undefined>({} as ButtonProps["isLoading"]);
assertType<ReactNode | undefined>({} as ButtonProps["loadingText"]);
assertType<ReactNode | undefined>({} as ButtonProps["leftIcon"]);
assertType<ReactNode | undefined>({} as ButtonProps["rightIcon"]);
assertType<"button" | "submit" | "reset" | undefined>({} as ButtonProps["type"]);

const _variant: ButtonProps["variant"] = "solid";
const _size: ButtonProps["size"] = "md";
const _scheme: ButtonProps["scheme"] = "primary";

type _HasRecipeProps = ExpectTrue<
    "variant" extends keyof ButtonProps
        ? "size" extends keyof ButtonProps
            ? "scheme" extends keyof ButtonProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ButtonProps
        ? "color" extends keyof ButtonProps
            ? "p" extends keyof ButtonProps
                ? "m" extends keyof ButtonProps
                    ? "w" extends keyof ButtonProps
                        ? "h" extends keyof ButtonProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_recipeProps && _styleProps && _variant && _size && _scheme);

assertType<ButtonProps>({
    children: "Save",
    onClick: () => {},
    isDisabled: false,
    isLoading: false,
    loadingText: "Saving",
    leftIcon: null,
    rightIcon: null,
    type: "button",
    variant: "solid",
    size: "md",
    scheme: "primary",
    className: "custom-button",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<ButtonProps>({
    // @ts-expect-error invalid variant
    variant: "invalid"
});

assertType<ButtonProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<ButtonProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});
