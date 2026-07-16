import { assertType } from "vitest";
import type { FlexProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasLayoutProps = ExpectTrue<
    "direction" extends keyof FlexProps
        ? "align" extends keyof FlexProps
            ? "justify" extends keyof FlexProps
                ? "wrap" extends keyof FlexProps
                    ? "grow" extends keyof FlexProps
                        ? "shrink" extends keyof FlexProps
                            ? "basis" extends keyof FlexProps
                                ? true
                                : false
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof FlexProps
        ? "color" extends keyof FlexProps
            ? "p" extends keyof FlexProps
                ? "m" extends keyof FlexProps
                    ? "w" extends keyof FlexProps
                        ? "h" extends keyof FlexProps
                            ? "gap" extends keyof FlexProps
                                ? true
                                : false
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _direction: FlexProps["direction"] = "column";
const _align: FlexProps["align"] = "center";
const _justify: FlexProps["justify"] = "space-between";
const _wrap: FlexProps["wrap"] = "wrap";

const _layoutProps: _HasLayoutProps = true;
const _styleProps: _HasStyleProps = true;

void (_layoutProps && _styleProps && _direction && _align && _justify && _wrap);

assertType<FlexProps>({
    direction: "row",
    align: "center",
    justify: "flex-start",
    wrap: "nowrap",
    grow: 1,
    shrink: 0,
    basis: "auto",
    gap: 4,
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    className: "custom-flex",
    children: "content"
});

assertType<FlexProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
