import type { ChangeDetails, CommitDetails } from "@ui-sdk/core";
import type { OTPInputPattern, OTPInputValueChangeReason } from "@ui-sdk/react/otp-input";
import { assertType } from "vitest";
import type { PinInputFieldProps, PinInputProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<
    ((value: string, details: ChangeDetails<OTPInputValueChangeReason>) => void) | undefined
>({} as PinInputProps["onValueChange"]);
assertType<
    ((value: string, details: CommitDetails<OTPInputValueChangeReason>) => void) | undefined
>({} as PinInputProps["onValueCommit"]);
assertType<string | undefined>({} as PinInputProps["value"]);
assertType<string | undefined>({} as PinInputProps["defaultValue"]);
assertType<number | undefined>({} as PinInputProps["maxLength"]);
assertType<OTPInputPattern | undefined>({} as PinInputProps["pattern"]);
assertType<boolean | undefined>({} as PinInputProps["mask"]);
assertType<boolean | undefined>({} as PinInputProps["disabled"]);
assertType<boolean | undefined>({} as PinInputProps["invalid"]);

const _size: PinInputProps["size"] = "md";
const _variant: PinInputProps["variant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onValueChange" extends KnownKeys<PinInputProps>
        ? "onValueCommit" extends KnownKeys<PinInputProps>
            ? "pattern" extends KnownKeys<PinInputProps>
                ? true
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChange" extends KnownKeys<PinInputProps>
        ? false
        : "onComplete" extends KnownKeys<PinInputProps>
          ? false
          : "isDisabled" extends KnownKeys<PinInputProps>
            ? false
            : "isInvalid" extends KnownKeys<PinInputProps>
              ? false
              : "otp" extends KnownKeys<PinInputProps>
                ? false
                : "manageFocus" extends KnownKeys<PinInputProps>
                  ? false
                  : true
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends KnownKeys<PinInputProps>
        ? "variant" extends KnownKeys<PinInputProps>
            ? true
            : false
        : false
>;

type _HasFieldParts = ExpectTrue<"index" extends KnownKeys<PinInputFieldProps> ? true : false>;

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _fieldParts: _HasFieldParts = true;

void (
    _callbackProps &&
    _noLegacyProps &&
    _recipeProps &&
    _fieldParts &&
    _size &&
    _variant
);

assertType<PinInputProps>({
    children: null,
    onValueChange: () => {},
    onValueCommit: () => {},
    value: "1234",
    defaultValue: "0000",
    maxLength: 4,
    pattern: "digits",
    mask: false,
    size: "md",
    variant: "filled",
    invalid: true,
    disabled: false,
    className: "custom-pin",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<PinInputProps>({
    children: null,
    // @ts-expect-error invalid size
    size: "3xl"
});

assertType<PinInputProps>({
    children: null,
    // @ts-expect-error invalid variant
    variant: "ghost"
});
