import { assertType } from "vitest";
import type { KbdProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: KbdProps["size"] = "md";

type _HasRecipeProps = ExpectTrue<"size" extends keyof KbdProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof KbdProps
        ? "color" extends keyof KbdProps
            ? "p" extends keyof KbdProps
                ? "m" extends keyof KbdProps
                    ? "w" extends keyof KbdProps
                        ? "h" extends keyof KbdProps
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

assertType<KbdProps>({
    as: "kbd",
    size: "lg",
    children: "Ctrl",
    className: "custom-kbd",
    bg: "alpha.100",
    color: "fg",
    p: 1,
    m: 0,
    w: "fit-content",
    h: "auto"
});

assertType<KbdProps>({
    // @ts-expect-error invalid size
    size: "xl"
});
