import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as Fieldset from "./index";

type ExpectTrue<T extends true> = T;
type FieldsetRootProps = ComponentProps<typeof Fieldset.Root>;

assertType<boolean | undefined>({} as FieldsetRootProps["disabled"]);
assertType<boolean | undefined>({} as FieldsetRootProps["invalid"]);

const _size: FieldsetRootProps["size"] = "md";

type _HasGroupProps = ExpectTrue<
    "disabled" extends keyof FieldsetRootProps
        ? "invalid" extends keyof FieldsetRootProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof FieldsetRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof FieldsetRootProps
        ? "color" extends keyof FieldsetRootProps
            ? "p" extends keyof FieldsetRootProps
                ? "m" extends keyof FieldsetRootProps
                    ? "w" extends keyof FieldsetRootProps
                        ? "h" extends keyof FieldsetRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _groupProps: _HasGroupProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_groupProps && _recipeProps && _styleProps && _size);

assertType<FieldsetRootProps>({
    disabled: false,
    invalid: false,
    size: "md",
    className: "custom-fieldset",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<FieldsetRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});
