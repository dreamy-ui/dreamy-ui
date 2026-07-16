import { assertType } from "vitest";
import type { SpinnerProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string | undefined>({} as SpinnerProps["label"]);
assertType<SpinnerProps["labelProps"]>({} as SpinnerProps["labelProps"]);
assertType<`${number}s` | `${number}ms` | undefined>({} as SpinnerProps["speed"]);

const _size: SpinnerProps["size"] = "md";

type _HasRecipeProps = ExpectTrue<"size" extends keyof SpinnerProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SpinnerProps
        ? "color" extends keyof SpinnerProps
            ? "p" extends keyof SpinnerProps
                ? "m" extends keyof SpinnerProps
                    ? "w" extends keyof SpinnerProps
                        ? "h" extends keyof SpinnerProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_recipeProps && _styleProps && _size);

assertType<SpinnerProps>({
    label: "Loading",
    labelProps: { className: "spinner-label" },
    size: "lg",
    speed: "0.5s",
    "aria-label": "Loading",
    role: "status",
    className: "custom-spinner",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<SpinnerProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<SpinnerProps>({
    // @ts-expect-error speed must use s or ms units
    speed: "fast"
});
