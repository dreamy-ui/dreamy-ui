import { assertType } from "vitest";
import type { IconProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: IconProps["size"] = "md";

type _HasRecipeProps = ExpectTrue<"size" extends keyof IconProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof IconProps
        ? "color" extends keyof IconProps
            ? "p" extends keyof IconProps
                ? "m" extends keyof IconProps
                    ? "w" extends keyof IconProps
                        ? "h" extends keyof IconProps
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

void (_recipeProps && _styleProps && _size);

assertType<IconProps>({
    size: "xl",
    "aria-hidden": true,
    focusable: false,
    "aria-label": "Warning",
    className: "custom-icon",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 0,
    w: 5,
    h: 5
});

assertType<IconProps>({
    // @ts-expect-error invalid size
    size: "3xl"
});
