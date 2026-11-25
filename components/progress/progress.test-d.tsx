import { assertType } from "vitest";
import type { GaugeLabelDetails, NumberFormat, ProgressProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<number | null | undefined>({} as ProgressProps["value"]);
assertType<number | undefined>({} as ProgressProps["min"]);
assertType<number | undefined>({} as ProgressProps["max"]);
assertType<string | undefined>({} as ProgressProps["speed"]);
assertType<string | undefined>({} as ProgressProps["aria-label"]);
assertType<React.ReactNode | undefined>({} as ProgressProps["label"]);
assertType<boolean | undefined>({} as ProgressProps["showValue"]);
assertType<NumberFormat | undefined>({} as ProgressProps["format"]);
assertType<string | undefined>({} as ProgressProps["locale"]);
assertType<
    ((value: number | null, details: GaugeLabelDetails<number | null>) => string) | undefined
>({} as ProgressProps["getValueLabel"]);
assertType<boolean | undefined>({} as ProgressProps["debug"]);

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
