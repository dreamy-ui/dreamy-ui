import { assertType } from "vitest";
import type { BadgeProps } from "./index";

type ExpectTrue<T extends true> = T;

const _scheme: BadgeProps["scheme"] = "primary";
const _variant: BadgeProps["variant"] = "subtle";

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof BadgeProps
        ? "variant" extends keyof BadgeProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof BadgeProps
        ? "color" extends keyof BadgeProps
            ? "p" extends keyof BadgeProps
                ? "m" extends keyof BadgeProps
                    ? "w" extends keyof BadgeProps
                        ? "h" extends keyof BadgeProps
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

void (_recipeProps && _styleProps && _scheme && _variant);

assertType<BadgeProps>({
    scheme: "primary",
    variant: "subtle",
    "aria-label": "Status",
    className: "custom-badge",
    children: "New",
    bg: "transparent",
    color: "fg",
    p: 1,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<BadgeProps>({
    // @ts-expect-error invalid scheme
    scheme: "invalid"
});

assertType<BadgeProps>({
    // @ts-expect-error invalid variant
    variant: "solid"
});
