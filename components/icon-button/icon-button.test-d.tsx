import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { IconButtonProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string>({} as IconButtonProps["aria-label"]);
assertType<boolean | undefined>({} as IconButtonProps["isDisabled"]);
assertType<boolean | undefined>({} as IconButtonProps["isLoading"]);
assertType<ReactNode | undefined>({} as IconButtonProps["icon"]);

const _variant: IconButtonProps["variant"] = "ghost";
const _size: IconButtonProps["size"] = "sm";
const _scheme: IconButtonProps["scheme"] = "primary";

type _RequiresAriaLabel = ExpectTrue<"aria-label" extends keyof IconButtonProps ? true : false>;

type _HasRecipeProps = ExpectTrue<
    "variant" extends keyof IconButtonProps
        ? "size" extends keyof IconButtonProps
            ? "scheme" extends keyof IconButtonProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof IconButtonProps
        ? "color" extends keyof IconButtonProps
            ? "p" extends keyof IconButtonProps
                ? "m" extends keyof IconButtonProps
                    ? "w" extends keyof IconButtonProps
                        ? "h" extends keyof IconButtonProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _requiresAriaLabel: _RequiresAriaLabel = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_requiresAriaLabel && _recipeProps && _styleProps && _variant && _size && _scheme);

assertType<IconButtonProps>({
    "aria-label": "Edit profile",
    icon: null,
    isDisabled: false,
    isLoading: false,
    variant: "ghost",
    size: "sm",
    scheme: "primary",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "auto",
    h: "auto"
});

assertType<IconButtonProps>(
    // @ts-expect-error aria-label is required
    {
        icon: null
    }
);

assertType<IconButtonProps>({
    "aria-label": "Edit",
    // @ts-expect-error invalid variant
    variant: "invalid"
});

assertType<IconButtonProps>({
    "aria-label": "Edit",
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<IconButtonProps>({
    "aria-label": "Edit",
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});
