import type { SliderController } from "@ui-sdk/react/slider";
import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as Slider from "./index";

type ExpectTrue<T extends true> = T;
type SliderRootProps = ComponentProps<typeof Slider.Root>;
type SliderValueProps = ComponentProps<typeof Slider.Value>;
type SliderThumbProps = ComponentProps<typeof Slider.Thumb>;

assertType<number | undefined>({} as SliderRootProps["value"]);
assertType<number | undefined>({} as SliderRootProps["defaultValue"]);
assertType<number | undefined>({} as SliderRootProps["min"]);
assertType<number | undefined>({} as SliderRootProps["max"]);
assertType<number | undefined>({} as SliderRootProps["step"]);
assertType<number | undefined>({} as SliderRootProps["largeStep"]);
assertType<Intl.NumberFormatOptions | ((value: number) => string) | undefined>(
    {} as SliderRootProps["format"]
);
assertType<string | undefined>({} as SliderRootProps["locale"]);
assertType<string | undefined>({} as SliderRootProps["name"]);
assertType<string | undefined>({} as SliderRootProps["form"]);
assertType<SliderController<number> | undefined>({} as SliderRootProps["controller"]);
assertType<"horizontal" | "vertical" | undefined>({} as SliderRootProps["orientation"]);
assertType<((value: number, details: never) => void) | undefined>(
    {} as SliderRootProps["onValueChange"]
);
assertType<((value: number, details: never) => void) | undefined>(
    {} as SliderRootProps["onValueCommit"]
);
assertType<boolean | undefined>({} as SliderRootProps["disabled"]);
assertType<boolean | undefined>({} as SliderRootProps["readOnly"]);
assertType<boolean | undefined>({} as SliderRootProps["required"]);
assertType<boolean | undefined>({} as SliderRootProps["isInvalid"]);
assertType<boolean | undefined>({} as SliderRootProps["hideThumb"]);
assertType<number | undefined>({} as SliderRootProps["thumbSize"]);
assertType<boolean | undefined>({} as SliderRootProps["isReversed"]);
assertType<string | undefined>({} as SliderRootProps["aria-label"]);

const _controller = Slider.createSliderController<number>();
assertType<SliderController<number>>(_controller);
assertType<SliderValueProps>({ children: (state) => state.text });
assertType<SliderThumbProps>({ children: (state) => String(state.thumbValue) });

const _scheme: SliderRootProps["scheme"] = "primary";
const _size: SliderRootProps["size"] = "md";

type _HasValueProps = ExpectTrue<
    "value" extends keyof SliderRootProps
        ? "onValueChange" extends keyof SliderRootProps
            ? "orientation" extends keyof SliderRootProps
                ? true
                : false
            : false
        : false
>;

const _valueProps: _HasValueProps = true;

void _valueProps;
void _scheme;
void _size;
