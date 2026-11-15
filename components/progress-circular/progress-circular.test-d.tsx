import { assertType } from "vitest";
import type { ProgressCircularProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<number | null | undefined>({} as ProgressCircularProps["value"]);
assertType<number | undefined>({} as ProgressCircularProps["min"]);
assertType<number | undefined>({} as ProgressCircularProps["max"]);
assertType<string | undefined>({} as ProgressCircularProps["label"]);
assertType<string | undefined>({} as ProgressCircularProps["valueLabel"]);
assertType<boolean | undefined>({} as ProgressCircularProps["showValueLabel"]);
assertType<boolean | undefined>({} as ProgressCircularProps["isIndeterminate"]);
assertType<boolean | undefined>({} as ProgressCircularProps["disabled"]);
assertType<string | undefined>({} as ProgressCircularProps["speed"]);

const _size: ProgressCircularProps["size"] = "md";
const _scheme: ProgressCircularProps["scheme"] = "primary";

type _HasValueProps = ExpectTrue<
    "value" extends keyof ProgressCircularProps
        ? "min" extends keyof ProgressCircularProps
            ? "max" extends keyof ProgressCircularProps
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
