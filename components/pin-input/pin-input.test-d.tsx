import { assertType } from "vitest";
import type { PinInputFieldProps, PinInputProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<((value: string) => void) | undefined>({} as PinInputProps["onChange"]);
assertType<((value: string) => void) | undefined>({} as PinInputProps["onComplete"]);
assertType<string | undefined>({} as PinInputProps["value"]);
assertType<string | undefined>({} as PinInputProps["defaultValue"]);
assertType<boolean | undefined>({} as PinInputProps["otp"]);
assertType<boolean | undefined>({} as PinInputProps["manageFocus"]);
assertType<boolean | undefined>({} as PinInputProps["mask"]);
assertType<boolean | undefined>({} as PinInputProps["isDisabled"]);
assertType<boolean | undefined>({} as PinInputProps["isInvalid"]);
assertType<"alphanumeric" | "number" | undefined>({} as PinInputProps["type"]);

const _size: PinInputProps["size"] = "md";
const _variant: PinInputProps["variant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof PinInputProps
        ? "onComplete" extends keyof PinInputProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof PinInputProps
        ? "variant" extends keyof PinInputProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof PinInputProps
        ? "color" extends keyof PinInputProps
            ? "p" extends keyof PinInputProps
                ? "m" extends keyof PinInputProps
                    ? "w" extends keyof PinInputProps
                        ? "h" extends keyof PinInputProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasFieldParts = ExpectTrue<"className" extends keyof PinInputFieldProps ? true : false>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _fieldParts: _HasFieldParts = true;

void (_callbackProps && _recipeProps && _styleProps && _fieldParts && _size && _variant);

assertType<PinInputProps>({
    children: null,
    onChange: () => {},
    onComplete: () => {},
    value: "1234",
    defaultValue: "0000",
    otp: true,
    manageFocus: true,
    mask: false,
    type: "number",
    size: "md",
    variant: "filled",
    isInvalid: true,
    className: "custom-pin",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<PinInputProps["onChange"]>(
    // @ts-expect-error onChange receives the pin string, not a boolean
    (_value: boolean) => {}
);

assertType<PinInputProps>({
    children: null,
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<PinInputProps>({
    children: null,
    // @ts-expect-error invalid variant
    variant: "ghost"
});

assertType<PinInputProps>({
    children: null,
    // @ts-expect-error invalid type
    type: "text"
});
