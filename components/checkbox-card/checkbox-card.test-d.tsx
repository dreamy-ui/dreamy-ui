import type { ChangeDetails } from "@ui-sdk/core";
import type { CheckboxCheckedChangeReason, CheckedState } from "@ui-sdk/react/checkbox";
import { assertType } from "vitest";
import type {
    CheckboxCardCheckboxProps,
    CheckboxCardDescriptionProps,
    CheckboxCardRootProps,
    CheckboxCardTitleProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<
    ((checked: CheckedState, details: ChangeDetails<CheckboxCheckedChangeReason>) => void) | undefined
>({} as CheckboxCardRootProps["onCheckedChange"]);
assertType<CheckedState | undefined>({} as CheckboxCardRootProps["checked"]);
assertType<CheckedState | undefined>({} as CheckboxCardRootProps["defaultChecked"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["disabled"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["invalid"]);

const _scheme: CheckboxCardRootProps["scheme"] = "primary";
const _size: CheckboxCardRootProps["size"] = "md";
const _variant: CheckboxCardRootProps["variant"] = "outline";
const _checkboxVariant: CheckboxCardRootProps["checkboxVariant"] = "solid";

type _HasCallbackProps = ExpectTrue<
    "onCheckedChange" extends KnownKeys<CheckboxCardRootProps> ? true : false
>;

type _HasNoLegacyProps = ExpectTrue<
    "isChecked" extends KnownKeys<CheckboxCardRootProps>
        ? false
        : "isDisabled" extends KnownKeys<CheckboxCardRootProps>
          ? false
          : "onChangeValue" extends KnownKeys<CheckboxCardRootProps>
            ? false
            : true
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends KnownKeys<CheckboxCardRootProps>
        ? "size" extends KnownKeys<CheckboxCardRootProps>
            ? "variant" extends KnownKeys<CheckboxCardRootProps>
                ? "checkboxVariant" extends KnownKeys<CheckboxCardRootProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof CheckboxCardRootProps
        ? "color" extends keyof CheckboxCardRootProps
            ? "p" extends keyof CheckboxCardRootProps
                ? "m" extends keyof CheckboxCardRootProps
                    ? "w" extends keyof CheckboxCardRootProps
                        ? "h" extends keyof CheckboxCardRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

assertType<string | undefined>({} as CheckboxCardTitleProps["className"]);
assertType<string | undefined>({} as CheckboxCardDescriptionProps["className"]);
assertType<string | undefined>({} as CheckboxCardCheckboxProps["className"]);

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _HasNoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (
    _callbackProps &&
    _noLegacyProps &&
    _recipeProps &&
    _styleProps &&
    _scheme &&
    _size &&
    _variant &&
    _checkboxVariant
);

assertType<CheckboxCardRootProps>({
    onCheckedChange: () => {},
    checked: true,
    defaultChecked: false,
    disabled: false,
    invalid: false,
    scheme: "primary",
    size: "md",
    variant: "subtle",
    checkboxVariant: "outline",
    name: "addons",
    value: "analytics",
    className: "custom-card",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<CheckboxCardRootProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<CheckboxCardRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<CheckboxCardRootProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
