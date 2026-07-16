import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as RangeSlider from "./index";

type ExpectTrue<T extends true> = T;
type RangeSliderRootProps = ComponentProps<typeof RangeSlider.Root>;

assertType<[number, number] | undefined>({} as RangeSliderRootProps["value"]);
assertType<[number, number] | undefined>({} as RangeSliderRootProps["defaultValue"]);
assertType<number | undefined>({} as RangeSliderRootProps["min"]);
assertType<number | undefined>({} as RangeSliderRootProps["max"]);
assertType<number | undefined>({} as RangeSliderRootProps["step"]);
assertType<"horizontal" | "vertical" | undefined>({} as RangeSliderRootProps["orientation"]);
assertType<((value: [number, number]) => void) | undefined>(
    {} as RangeSliderRootProps["onChangeValue"]
);
assertType<[string, string] | undefined>({} as RangeSliderRootProps["aria-label"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["isDisabled"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["isReadOnly"]);

const _scheme: RangeSliderRootProps["scheme"] = "primary";
const _size: RangeSliderRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof RangeSliderRootProps
        ? "onChangeValue" extends keyof RangeSliderRootProps
            ? "aria-label" extends keyof RangeSliderRootProps
                ? true
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof RangeSliderRootProps
        ? "size" extends keyof RangeSliderRootProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof RangeSliderRootProps
        ? "color" extends keyof RangeSliderRootProps
            ? "p" extends keyof RangeSliderRootProps
                ? "m" extends keyof RangeSliderRootProps
                    ? "w" extends keyof RangeSliderRootProps
                        ? "h" extends keyof RangeSliderRootProps
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

void (_valueProps && _recipeProps && _styleProps && _scheme && _size);

assertType<RangeSliderRootProps>({
    value: [20, 80],
    defaultValue: [0, 100],
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    onChangeValue: () => {},
    "aria-label": ["Minimum", "Maximum"],
    isDisabled: false,
    isReadOnly: false,
    scheme: "primary",
    size: "md",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<RangeSliderRootProps>({
    // @ts-expect-error aria-label must be a string tuple
    "aria-label": "Price"
});

assertType<RangeSliderRootProps>({
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});

assertType<RangeSliderRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<RangeSliderRootProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});
