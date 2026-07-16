import { assertType } from "vitest";
import type { WrapProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasLayoutProps = ExpectTrue<
    "gap" extends keyof WrapProps
        ? "rowGap" extends keyof WrapProps
            ? "columnGap" extends keyof WrapProps
                ? "align" extends keyof WrapProps
                    ? "justify" extends keyof WrapProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof WrapProps
        ? "color" extends keyof WrapProps
            ? "p" extends keyof WrapProps
                ? "m" extends keyof WrapProps
                    ? "w" extends keyof WrapProps
                        ? "h" extends keyof WrapProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _gap: WrapProps["gap"] = 2;
const _align: WrapProps["align"] = "center";
const _justify: WrapProps["justify"] = "flex-start";

const _layoutProps: _HasLayoutProps = true;
const _styleProps: _HasStyleProps = true;

void (_layoutProps && _styleProps && _gap && _align && _justify);

assertType<WrapProps>({
    gap: 4,
    rowGap: 2,
    columnGap: 2,
    align: "center",
    justify: "space-between",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    className: "custom-wrap",
    children: "content"
});

assertType<WrapProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
