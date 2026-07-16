import { assertType } from "vitest";
import type { HStackProps, StackProps, VStackProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasStackLayoutProps = ExpectTrue<
    "direction" extends keyof StackProps
        ? "gap" extends keyof StackProps
            ? "align" extends keyof StackProps
                ? "justify" extends keyof StackProps
                    ? "separator" extends keyof StackProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof StackProps
        ? "color" extends keyof StackProps
            ? "p" extends keyof StackProps
                ? "m" extends keyof StackProps
                    ? "w" extends keyof StackProps
                        ? "h" extends keyof StackProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasHStackProps = ExpectTrue<
    "gap" extends keyof HStackProps
        ? "align" extends keyof HStackProps
            ? "justify" extends keyof HStackProps
                ? "separator" extends keyof HStackProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasVStackProps = ExpectTrue<
    "gap" extends keyof VStackProps
        ? "align" extends keyof VStackProps
            ? "justify" extends keyof VStackProps
                ? "separator" extends keyof VStackProps
                    ? true
                    : false
                : false
            : false
        : false
>;

const _direction: StackProps["direction"] = "vertical";
const _gap: StackProps["gap"] = 2;

const _stackLayout: _HasStackLayoutProps = true;
const _styleProps: _HasStyleProps = true;
const _hstackProps: _HasHStackProps = true;
const _vstackProps: _HasVStackProps = true;

void (_stackLayout && _styleProps && _hstackProps && _vstackProps && _direction && _gap);

assertType<StackProps>({
    direction: "horizontal",
    gap: 4,
    align: "center",
    justify: "flex-start",
    separator: "|",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    className: "custom-stack",
    children: "content"
});

assertType<HStackProps>({
    gap: 2,
    align: "center",
    justify: "space-between",
    separator: null,
    p: 1
});

assertType<VStackProps>({
    gap: 3,
    align: "stretch",
    justify: "center",
    bg: "bg"
});

assertType<StackProps>({
    // @ts-expect-error invalid stack direction
    direction: "diagonal"
});
