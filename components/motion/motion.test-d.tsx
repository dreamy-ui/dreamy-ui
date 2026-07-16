import { assertType } from "vitest";
import type { MotionBoxProps, MotionFlexProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasMotionProps = ExpectTrue<
    "animate" extends keyof MotionBoxProps
        ? "initial" extends keyof MotionBoxProps
            ? "transition" extends keyof MotionBoxProps
                ? "exit" extends keyof MotionBoxProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof MotionBoxProps
        ? "color" extends keyof MotionBoxProps
            ? "p" extends keyof MotionBoxProps
                ? "m" extends keyof MotionBoxProps
                    ? "w" extends keyof MotionBoxProps
                        ? "h" extends keyof MotionBoxProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasFlexLayoutProps = ExpectTrue<
    "direction" extends keyof MotionFlexProps
        ? "align" extends keyof MotionFlexProps
            ? "justify" extends keyof MotionFlexProps
                ? "wrap" extends keyof MotionFlexProps
                    ? "gap" extends keyof MotionFlexProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

const _animate: MotionBoxProps["animate"] = { opacity: 1 };
const _initial: MotionBoxProps["initial"] = { opacity: 0 };
const _direction: MotionFlexProps["direction"] = "column";

const _motionProps: _HasMotionProps = true;
const _styleProps: _HasStyleProps = true;
const _flexLayout: _HasFlexLayoutProps = true;

void (_motionProps && _styleProps && _flexLayout && _animate && _initial && _direction);

assertType<MotionBoxProps>({
    animate: { opacity: 1 },
    initial: { opacity: 0 },
    transition: { duration: 0.2 },
    exit: { opacity: 0 },
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    className: "custom-motion",
    children: "content"
});

assertType<MotionFlexProps>({
    direction: "row",
    align: "center",
    justify: "space-between",
    wrap: "wrap",
    gap: 4,
    grow: 1,
    shrink: 0,
    basis: "auto",
    animate: { x: 0 },
    initial: { x: -10 },
    bg: "bg",
    p: 2
});

assertType<MotionFlexProps>({
    // @ts-expect-error unknown prop is not accepted
    notARealProp: true
});
