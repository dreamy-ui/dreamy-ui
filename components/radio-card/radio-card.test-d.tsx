import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type {
    RadioCardDescriptionProps,
    RadioCardRadioProps,
    RadioCardRootProps,
    RadioCardTitleProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>({} as RadioCardRootProps["onChange"]);
assertType<string | number | undefined>({} as RadioCardRootProps["value"]);
assertType<boolean | undefined>({} as RadioCardRootProps["isChecked"]);
assertType<boolean | undefined>({} as RadioCardRootProps["defaultChecked"]);
assertType<boolean | undefined>({} as RadioCardRootProps["isDisabled"]);
assertType<boolean | undefined>({} as RadioCardRootProps["isInvalid"]);

const _scheme: RadioCardRootProps["scheme"] = "primary";
const _size: RadioCardRootProps["size"] = "md";
const _variant: RadioCardRootProps["variant"] = "outline";

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof RadioCardRootProps
        ? "size" extends keyof RadioCardRootProps
            ? "variant" extends keyof RadioCardRootProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof RadioCardRootProps
        ? "color" extends keyof RadioCardRootProps
            ? "p" extends keyof RadioCardRootProps
                ? "m" extends keyof RadioCardRootProps
                    ? "w" extends keyof RadioCardRootProps
                        ? "h" extends keyof RadioCardRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "className" extends keyof RadioCardTitleProps
        ? "className" extends keyof RadioCardDescriptionProps
            ? "className" extends keyof RadioCardRadioProps
                ? true
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_recipeProps && _styleProps && _partProps && _scheme && _size && _variant);

assertType<RadioCardRootProps>({
    onChange: () => {},
    value: "pro",
    isChecked: true,
    defaultChecked: false,
    scheme: "primary",
    size: "md",
    variant: "subtle",
    name: "plan",
    className: "custom-radio-card",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<RadioCardRootProps["onChange"]>(
    // @ts-expect-error onChange must receive a change event, not a string
    (_value: string) => {}
);

assertType<RadioCardRootProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<RadioCardRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<RadioCardRootProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
