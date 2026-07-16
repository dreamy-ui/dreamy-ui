import { assertType } from "vitest";
import type { SkeletonProps, SkeletonTextProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<SkeletonProps["isLoaded"]>({} as SkeletonProps["isLoaded"]);
assertType<number | undefined>({} as SkeletonTextProps["lines"]);

const _variant: SkeletonProps["variant"] = "pulse";
const _loaded: SkeletonProps["isLoaded"] = true;

type _HasRecipeProps = ExpectTrue<
    "isLoaded" extends keyof SkeletonProps
        ? "variant" extends keyof SkeletonProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SkeletonProps
        ? "color" extends keyof SkeletonProps
            ? "p" extends keyof SkeletonProps
                ? "m" extends keyof SkeletonProps
                    ? "w" extends keyof SkeletonProps
                        ? "h" extends keyof SkeletonProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasLines = ExpectTrue<"lines" extends keyof SkeletonTextProps ? true : false>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _lines: _HasLines = true;

void (_recipeProps && _styleProps && _lines && _variant && _loaded);

assertType<SkeletonProps>({
    isLoaded: false,
    variant: "shine",
    "aria-hidden": true,
    className: "custom-skeleton",
    bg: "alpha.200",
    color: "transparent",
    p: 2,
    m: 1,
    w: "full",
    h: 4
});

assertType<SkeletonTextProps>({
    lines: 3,
    isLoaded: true,
    variant: "none"
});

assertType<SkeletonProps>({
    // @ts-expect-error invalid variant
    variant: "bounce"
});

assertType<SkeletonTextProps>({
    // @ts-expect-error lines must be a number
    lines: "3"
});
