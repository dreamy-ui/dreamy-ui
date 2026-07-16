import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { SwitchProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLInputElement> | undefined>({} as SwitchProps["onChange"]);
assertType<((value: boolean) => void) | undefined>({} as SwitchProps["onChangeValue"]);

assertType<boolean | undefined>({} as SwitchProps["isChecked"]);
assertType<boolean | undefined>({} as SwitchProps["defaultChecked"]);
assertType<boolean | undefined>({} as SwitchProps["isIndeterminate"]);

assertType<SwitchProps["inputProps"]>({} as SwitchProps["inputProps"]);
assertType<SwitchProps["wrapperProps"]>({} as SwitchProps["wrapperProps"]);
assertType<SwitchProps["labelProps"]>({} as SwitchProps["labelProps"]);

const _scheme: SwitchProps["scheme"] = "primary";
const _size: SwitchProps["size"] = "md";

assertType<string | undefined>({} as SwitchProps["name"]);
assertType<boolean | undefined>({} as SwitchProps["isDisabled"]);
assertType<boolean | undefined>({} as SwitchProps["isRequired"]);
assertType<boolean | undefined>({} as SwitchProps["isInvalid"]);
assertType<boolean | undefined>({} as SwitchProps["isReadOnly"]);
assertType<string | undefined>({} as SwitchProps["aria-label"]);
assertType<string | undefined>({} as SwitchProps["aria-labelledby"]);
assertType<string | undefined>({} as SwitchProps["aria-describedby"]);
assertType<boolean | undefined>({} as SwitchProps["reduceMotion"]);

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof SwitchProps
        ? "onChangeValue" extends keyof SwitchProps
            ? true
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "inputProps" extends keyof SwitchProps
        ? "wrapperProps" extends keyof SwitchProps
            ? "labelProps" extends keyof SwitchProps
                ? "thumbProps" extends keyof SwitchProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "scheme" extends keyof SwitchProps ? ("size" extends keyof SwitchProps ? true : false) : false
>;

type _HasFieldProps = ExpectTrue<
    "isDisabled" extends keyof SwitchProps
        ? "isInvalid" extends keyof SwitchProps
            ? "isRequired" extends keyof SwitchProps
                ? "isReadOnly" extends keyof SwitchProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasA11yProps = ExpectTrue<
    "aria-label" extends keyof SwitchProps
        ? "aria-labelledby" extends keyof SwitchProps
            ? "aria-describedby" extends keyof SwitchProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof SwitchProps
        ? "color" extends keyof SwitchProps
            ? "p" extends keyof SwitchProps
                ? "m" extends keyof SwitchProps
                    ? "w" extends keyof SwitchProps
                        ? "h" extends keyof SwitchProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _partProps: _HasPartProps = true;
const _recipeProps: _HasRecipeProps = true;
const _fieldProps: _HasFieldProps = true;
const _a11yProps: _HasA11yProps = true;
const _styleProps: _HasStyleProps = true;

void (
    _callbackProps &&
    _partProps &&
    _recipeProps &&
    _fieldProps &&
    _a11yProps &&
    _styleProps &&
    _scheme &&
    _size
);

assertType<SwitchProps>({
    onChange: () => {},
    onChangeValue: () => {},
    isChecked: true,
    defaultChecked: false,
    scheme: "primary",
    size: "md",
    name: "notifications",
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    isReadOnly: false,
    reduceMotion: true,
    "aria-label": "Notifications",
    "aria-labelledby": "label-id",
    "aria-describedby": "hint-id",
    inputProps: { id: "switch-input", name: "notifications" },
    wrapperProps: { className: "switch-control" },
    labelProps: { className: "switch-label" },
    thumbProps: { layout: false },
    className: "custom-switch",
    id: "switch-root",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<SwitchProps["onChange"]>(
    // @ts-expect-error onChange must receive a change event, not a boolean
    (_value: boolean) => {}
);

assertType<SwitchProps>({
    inputProps: {
        // @ts-expect-error inputProps must use input attributes
        scheme: "primary"
    }
});

assertType<SwitchProps>({
    // @ts-expect-error invalid color scheme
    scheme: "invalid"
});

assertType<SwitchProps>({
    // @ts-expect-error invalid size
    size: "xl"
});
