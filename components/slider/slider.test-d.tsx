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
