import type { ChangeDetails } from "@ui-sdk/core";
import type { RadioGroupValueChangeReason } from "@ui-sdk/react/radio";
import { assertType } from "vitest";
import type {
    RadioCardDescriptionProps,
    RadioCardRadioProps,
    RadioCardRootProps,
    RadioCardTitleProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<string>({} as RadioCardRootProps["value"]);
assertType<boolean | undefined>({} as RadioCardRootProps["checked"]);
assertType<boolean | undefined>({} as RadioCardRootProps["defaultChecked"]);
assertType<boolean | undefined>({} as RadioCardRootProps["disabled"]);
assertType<boolean | undefined>({} as RadioCardRootProps["invalid"]);
assertType<
    ((checked: boolean, details: ChangeDetails<RadioGroupValueChangeReason>) => void) | undefined
>({} as RadioCardRootProps["onCheckedChange"]);

const _scheme: RadioCardRootProps["scheme"] = "primary";
const _size: RadioCardRootProps["size"] = "md";
const _variant: RadioCardRootProps["variant"] = "outline";

type _HasNoLegacyProps = ExpectTrue<
    "isChecked" extends KnownKeys<RadioCardRootProps>
        ? false
        : "isDisabled" extends KnownKeys<RadioCardRootProps>
          ? false
          : "isInvalid" extends KnownKeys<RadioCardRootProps>
            ? false
            : true
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends KnownKeys<RadioCardRootProps>
        ? "size" extends KnownKeys<RadioCardRootProps>
            ? "variant" extends KnownKeys<RadioCardRootProps>
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

assertType<string | undefined>({} as RadioCardTitleProps["className"]);
assertType<string | undefined>({} as RadioCardDescriptionProps["className"]);
assertType<string | undefined>({} as RadioCardRadioProps["className"]);

const _noLegacyProps: _HasNoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_noLegacyProps && _recipeProps && _styleProps && _scheme && _size && _variant);

assertType<string | undefined>({} as RadioCardRootProps["form"]);

assertType<RadioCardRootProps>({
    onCheckedChange: () => {},
    value: "pro",
    checked: true,
    defaultChecked: false,
    disabled: false,
    invalid: false,
    scheme: "primary",
    size: "md",
    variant: "subtle",
    name: "plan",
    form: "checkout",
    className: "custom-radio-card",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<RadioCardRootProps>({
    value: "pro",
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<RadioCardRootProps>({
    value: "pro",
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<RadioCardRootProps>({
    value: "pro",
    // @ts-expect-error invalid variant
    variant: "ghost"
});
