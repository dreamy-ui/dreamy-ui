import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type {
    CheckboxCardCheckboxProps,
    CheckboxCardDescriptionProps,
    CheckboxCardRootProps,
    CheckboxCardTitleProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>(
    {} as CheckboxCardRootProps["onChange"]
);
assertType<((value: boolean) => void) | undefined>({} as CheckboxCardRootProps["onChangeValue"]);

assertType<boolean | undefined>({} as CheckboxCardRootProps["isChecked"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["defaultChecked"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["isIndeterminate"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["isDisabled"]);
assertType<boolean | undefined>({} as CheckboxCardRootProps["isInvalid"]);

const _scheme: CheckboxCardRootProps["scheme"] = "primary";
const _size: CheckboxCardRootProps["size"] = "md";
const _variant: CheckboxCardRootProps["variant"] = "outline";
const _checkboxVariant: CheckboxCardRootProps["checkboxVariant"] = "solid";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof CheckboxCardRootProps
        ? "onChangeValue" extends keyof CheckboxCardRootProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof CheckboxCardRootProps
        ? "size" extends keyof CheckboxCardRootProps
            ? "variant" extends keyof CheckboxCardRootProps
                ? "checkboxVariant" extends keyof CheckboxCardRootProps
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
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (
    _callbackProps &&
    _recipeProps &&
    _styleProps &&
    _scheme &&
    _size &&
    _variant &&
    _checkboxVariant
);

assertType<CheckboxCardRootProps>({
    onChange: () => {},
    onChangeValue: () => {},
    isChecked: true,
    defaultChecked: false,
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
