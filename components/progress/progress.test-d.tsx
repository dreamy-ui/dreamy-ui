import { assertType } from "vitest";
import type { ProgressProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<number | undefined>({} as ProgressProps["value"]);
assertType<number | undefined>({} as ProgressProps["min"]);
assertType<number | undefined>({} as ProgressProps["max"]);
assertType<string | undefined>({} as ProgressProps["speed"]);
assertType<string>({} as ProgressProps["aria-label"]);

const _size: ProgressProps["size"] = "md";
const _scheme: ProgressProps["scheme"] = "primary";

type _HasValueProps = ExpectTrue<
    "value" extends keyof ProgressProps
        ? "min" extends keyof ProgressProps
            ? "max" extends keyof ProgressProps
                ? true
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof ProgressProps
        ? "scheme" extends keyof ProgressProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ProgressProps
        ? "color" extends keyof ProgressProps
            ? "p" extends keyof ProgressProps
                ? "m" extends keyof ProgressProps
                    ? "w" extends keyof ProgressProps
                        ? "h" extends keyof ProgressProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _valueProps: _HasValueProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_valueProps && _recipeProps && _styleProps && _size && _scheme);

assertType<ProgressProps>({
    "aria-label": "Upload progress",
    value: 40,
    min: 0,
    max: 100,
    size: "md",
    scheme: "primary",
    speed: "1s",
    "aria-valuetext": "40 percent",
    className: "custom-progress",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 1,
    w: "full",
    h: "auto"
});

type _AriaLabelRequired = ExpectTrue<
    undefined extends ProgressProps["aria-label"] ? false : true
>;

const _ariaLabelRequired: _AriaLabelRequired = true;
void _ariaLabelRequired;

assertType<ProgressProps>({
    "aria-label": "Loading",
    // @ts-expect-error invalid size
    size: "xl"
});
assertType<ProgressProps>({
    "aria-label": "Loading",
    // @ts-expect-error invalid scheme
    scheme: "invalid"
});
