import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as Slider from "./index";

type ExpectTrue<T extends true> = T;
type SliderRootProps = ComponentProps<typeof Slider.Root>;

assertType<number | undefined>({} as SliderRootProps["value"]);
assertType<number | undefined>({} as SliderRootProps["defaultValue"]);
assertType<number | undefined>({} as SliderRootProps["min"]);
assertType<number | undefined>({} as SliderRootProps["max"]);
assertType<number | undefined>({} as SliderRootProps["step"]);
assertType<"horizontal" | "vertical" | undefined>({} as SliderRootProps["orientation"]);
assertType<((value: number) => void) | undefined>({} as SliderRootProps["onChangeValue"]);
assertType<boolean | undefined>({} as SliderRootProps["isDisabled"]);
assertType<boolean | undefined>({} as SliderRootProps["isReadOnly"]);
assertType<boolean | undefined>({} as SliderRootProps["isInvalid"]);
assertType<boolean | undefined>({} as SliderRootProps["hideThumb"]);
assertType<string | undefined>({} as SliderRootProps["aria-label"]);

const _scheme: SliderRootProps["scheme"] = "primary";
const _size: SliderRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof SliderRootProps
        ? "onChangeValue" extends keyof SliderRootProps
            ? "orientation" extends keyof SliderRootProps
                ? true
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof SliderRootProps
        ? "size" extends keyof SliderRootProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SliderRootProps
        ? "color" extends keyof SliderRootProps
            ? "p" extends keyof SliderRootProps
                ? "m" extends keyof SliderRootProps
                    ? "w" extends keyof SliderRootProps
                        ? "h" extends keyof SliderRootProps
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

assertType<SliderRootProps>({
    value: 40,
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    onChangeValue: () => {},
    isDisabled: false,
    isReadOnly: false,
    hideThumb: false,
    "aria-label": "Volume",
    scheme: "primary",
    size: "md",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<SliderRootProps>({
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});

assertType<SliderRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<SliderRootProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});
