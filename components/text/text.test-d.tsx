import { assertType } from "vitest";
import type { TextProps } from "./index";

type ExpectTrue<T extends true> = T;

const _size: TextProps["size"] = "md";

type _HasPatternProps = ExpectTrue<"size" extends keyof TextProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof TextProps
        ? "color" extends keyof TextProps
            ? "p" extends keyof TextProps
                ? "m" extends keyof TextProps
                    ? "w" extends keyof TextProps
                        ? "h" extends keyof TextProps
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

assertType<TextProps>({
    as: "span",
    size: "lg",
    children: "Body copy",
    className: "custom-text",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<TextProps>({
    // @ts-expect-error invalid size
    size: "huge"
});
