import { assertType } from "vitest";
import type { DividerProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasPatternProps = ExpectTrue<
    "orientation" extends keyof DividerProps
        ? "thickness" extends keyof DividerProps
            ? "color" extends keyof DividerProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof DividerProps
        ? "p" extends keyof DividerProps
            ? "m" extends keyof DividerProps
                ? "w" extends keyof DividerProps
                    ? "h" extends keyof DividerProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

const _orientation: DividerProps["orientation"] = "horizontal";
const _thickness: DividerProps["thickness"] = "1px";

const _patternProps: _HasPatternProps = true;
const _styleProps: _HasStyleProps = true;

void (_patternProps && _styleProps && _orientation && _thickness);

assertType<DividerProps>({
    orientation: "vertical",
    thickness: "2px",
    color: "border",
    bg: "primary",
    p: 0,
    m: 2,
    w: "full",
    h: "auto",
    className: "custom-divider"
});

assertType<DividerProps>({
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});
