import { assertType } from "vitest";
import type { HeadingProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: HeadingProps["size"] = "xl";

type _HasPatternProps = ExpectTrue<"size" extends keyof HeadingProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof HeadingProps
        ? "color" extends keyof HeadingProps
            ? "p" extends keyof HeadingProps
                ? "m" extends keyof HeadingProps
                    ? "w" extends keyof HeadingProps
                        ? "h" extends keyof HeadingProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _patternProps: _HasPatternProps = true;
const _styleProps: _HasStyleProps = true;

void (_patternProps && _styleProps && _size);

assertType<HeadingProps>({
    as: "h1",
    size: "2xl",
    children: "Page title",
    className: "custom-heading",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 2,
    w: "full",
    h: "auto"
});

assertType<HeadingProps>({
    // @ts-expect-error invalid size
    size: "huge"
});
