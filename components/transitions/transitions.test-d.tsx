import { assertType } from "vitest";
import type { CollapseProps, ScaleProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as CollapseProps["isOpen"]);
assertType<boolean | undefined>({} as CollapseProps["unmountOnExit"]);
assertType<boolean | undefined>({} as CollapseProps["animateOpacity"]);
assertType<number | string | undefined>({} as CollapseProps["startingHeight"]);
assertType<number | string | undefined>({} as CollapseProps["endingHeight"]);

assertType<boolean | undefined>({} as ScaleProps["isOpen"]);
assertType<boolean | undefined>({} as ScaleProps["unmountOnExit"]);
assertType<boolean | undefined>({} as ScaleProps["reverse"]);
assertType<number | undefined>({} as ScaleProps["initialScale"]);

type _CollapseHasOpenProps = ExpectTrue<
    "isOpen" extends keyof CollapseProps
        ? "unmountOnExit" extends keyof CollapseProps
            ? true
            : false
        : false
>;

type _CollapseHasMotionProps = ExpectTrue<
    "animateOpacity" extends keyof CollapseProps
        ? "startingHeight" extends keyof CollapseProps
            ? "endingHeight" extends keyof CollapseProps
                ? true
                : false
            : false
        : false
>;

type _ScaleHasOpenProps = ExpectTrue<
    "isOpen" extends keyof ScaleProps
        ? "unmountOnExit" extends keyof ScaleProps
            ? "initialScale" extends keyof ScaleProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof CollapseProps
        ? "p" extends keyof ScaleProps
            ? true
            : false
        : false
>;

const _collapseOpen: _CollapseHasOpenProps = true;
const _collapseMotion: _CollapseHasMotionProps = true;
const _scaleOpen: _ScaleHasOpenProps = true;
const _styleProps: _HasStyleProps = true;

void (_collapseOpen && _collapseMotion && _scaleOpen && _styleProps);

assertType<CollapseProps>({
    isOpen: true,
    unmountOnExit: true,
    animateOpacity: false,
    startingHeight: 0,
    endingHeight: "auto",
    className: "collapse",
    bg: "bg",
    p: 2
});

assertType<ScaleProps>({
    isOpen: false,
    unmountOnExit: true,
    reverse: true,
    initialScale: 0.95,
    className: "scale",
    p: 2
});

assertType<CollapseProps>({
    // @ts-expect-error startingHeight must be number or string
    startingHeight: { value: 0 }
});

assertType<ScaleProps>({
    // @ts-expect-error initialScale must be a number
    initialScale: "large"
});
