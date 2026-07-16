import { assertType } from "vitest";
import type { ProgressCircularProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<number | undefined>({} as ProgressCircularProps["value"]);
assertType<number | undefined>({} as ProgressCircularProps["minValue"]);
assertType<number | undefined>({} as ProgressCircularProps["maxValue"]);
assertType<string | undefined>({} as ProgressCircularProps["label"]);
assertType<string | undefined>({} as ProgressCircularProps["valueLabel"]);
assertType<boolean | undefined>({} as ProgressCircularProps["showValueLabel"]);
assertType<boolean | undefined>({} as ProgressCircularProps["isIndeterminate"]);
assertType<boolean | undefined>({} as ProgressCircularProps["isDisabled"]);
assertType<string | undefined>({} as ProgressCircularProps["speed"]);

const _size: ProgressCircularProps["size"] = "md";
const _scheme: ProgressCircularProps["scheme"] = "primary";

type _HasValueProps = ExpectTrue<
    "value" extends keyof ProgressCircularProps
        ? "minValue" extends keyof ProgressCircularProps
            ? "maxValue" extends keyof ProgressCircularProps
                ? "isIndeterminate" extends keyof ProgressCircularProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof ProgressCircularProps
        ? "scheme" extends keyof ProgressCircularProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ProgressCircularProps
        ? "color" extends keyof ProgressCircularProps
            ? "p" extends keyof ProgressCircularProps
                ? "m" extends keyof ProgressCircularProps
                    ? "w" extends keyof ProgressCircularProps
                        ? "h" extends keyof ProgressCircularProps
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

assertType<ProgressCircularProps>({
    value: 60,
    minValue: 0,
    maxValue: 100,
    label: "Loading",
    showValueLabel: true,
    valueLabel: "60%",
    isIndeterminate: false,
    isDisabled: false,
    speed: "1.5s",
    size: "md",
    scheme: "primary",
    "aria-label": "Loading results",
    className: "custom-progress-circular",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<ProgressCircularProps>({
    // @ts-expect-error invalid size
    size: "2xl"
});

assertType<ProgressCircularProps>({
    // @ts-expect-error invalid scheme
    scheme: "invalid"
});
