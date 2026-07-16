import { assertType } from "vitest";
import type { SpanProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SpanProps
        ? "color" extends keyof SpanProps
            ? "p" extends keyof SpanProps
                ? "m" extends keyof SpanProps
                    ? "w" extends keyof SpanProps
                        ? "h" extends keyof SpanProps
                            ? "fontSize" extends keyof SpanProps
                                ? "fontWeight" extends keyof SpanProps
                                    ? true
                                    : false
                                : false
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _styleProps: _HasStyleProps = true;

void _styleProps;

assertType<SpanProps>({
    className: "custom-span",
    id: "span-root",
    bg: "primary",
    color: "fg",
    p: 1,
    m: 0,
    w: "auto",
    h: "auto",
    fontSize: "md",
    fontWeight: "bold",
    children: "inline"
});

assertType<SpanProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
