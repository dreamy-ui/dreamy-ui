import { assertType } from "vitest";
import type { BoxProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof BoxProps
        ? "color" extends keyof BoxProps
            ? "p" extends keyof BoxProps
                ? "m" extends keyof BoxProps
                    ? "w" extends keyof BoxProps
                        ? "h" extends keyof BoxProps
                            ? "display" extends keyof BoxProps
                                ? "gap" extends keyof BoxProps
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

assertType<BoxProps>({
    className: "custom-box",
    id: "box-root",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    display: "flex",
    gap: 2,
    children: "content"
});

assertType<BoxProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
