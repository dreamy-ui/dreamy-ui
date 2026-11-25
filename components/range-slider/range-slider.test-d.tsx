import type { SliderController } from "@ui-sdk/react/slider";
import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as RangeSlider from "./index";

type ExpectTrue<T extends true> = T;
type RangeSliderRootProps = ComponentProps<typeof RangeSlider.Root>;
type RangeSliderValueProps = ComponentProps<typeof RangeSlider.Value>;
type RangeSliderThumbProps = ComponentProps<typeof RangeSlider.Thumb>;

assertType<[number, number] | undefined>({} as RangeSliderRootProps["value"]);
assertType<[number, number] | undefined>({} as RangeSliderRootProps["defaultValue"]);
assertType<number | undefined>({} as RangeSliderRootProps["min"]);
assertType<number | undefined>({} as RangeSliderRootProps["max"]);
assertType<number | undefined>({} as RangeSliderRootProps["step"]);
assertType<number | undefined>({} as RangeSliderRootProps["largeStep"]);
assertType<number | undefined>({} as RangeSliderRootProps["minStepsBetweenThumbs"]);
assertType<Intl.NumberFormatOptions | ((value: number) => string) | undefined>(
    {} as RangeSliderRootProps["format"]
);
assertType<string | undefined>({} as RangeSliderRootProps["locale"]);
assertType<string | undefined>({} as RangeSliderRootProps["name"]);
assertType<string | undefined>({} as RangeSliderRootProps["form"]);
assertType<SliderController<[number, number]> | undefined>({} as RangeSliderRootProps["controller"]);
assertType<"horizontal" | "vertical" | undefined>(
    {} as RangeSliderRootProps["orientation"]
);

const _controller = RangeSlider.createSliderController<[number, number]>();
assertType<SliderController<[number, number]>>(_controller);
assertType<RangeSliderValueProps>({ children: (state) => state.text });
assertType<RangeSliderThumbProps>({ index: 2, children: (state) => String(state.thumbValue) });
assertType<((value: [number, number], details: never) => void) | undefined>(
    {} as RangeSliderRootProps["onValueChange"]
);
assertType<((value: [number, number], details: never) => void) | undefined>(
    {} as RangeSliderRootProps["onValueCommit"]
);
assertType<boolean | undefined>({} as RangeSliderRootProps["disabled"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["readOnly"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["required"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["isInvalid"]);
assertType<number | undefined>({} as RangeSliderRootProps["thumbSize"]);
assertType<boolean | undefined>({} as RangeSliderRootProps["isReversed"]);

const _scheme: RangeSliderRootProps["scheme"] = "primary";
const _size: RangeSliderRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof RangeSliderRootProps
        ? "onValueChange" extends keyof RangeSliderRootProps
            ? "orientation" extends keyof RangeSliderRootProps
                ? true
                : false
            : false
        : false
>;

const _valueProps: _HasValueProps = true;

void _valueProps;
void _scheme;
void _size;
