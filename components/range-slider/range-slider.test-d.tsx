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
assertType<"horizontal" | "vertical" | undefined>(
    {} as RangeSliderRootProps["orientation"]
);
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
