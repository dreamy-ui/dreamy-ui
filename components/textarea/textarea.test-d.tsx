import type { ChangeEventHandler } from "react";
import { assertType } from "vitest";
import type { TextareaNoAutoSizeProps, TextareaProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ChangeEventHandler<HTMLTextAreaElement> | undefined>({} as TextareaProps["onChange"]);
assertType<((value: string) => void) | undefined>({} as TextareaProps["onChangeValue"]);
assertType<boolean | undefined>({} as TextareaProps["isDisabled"]);
assertType<boolean | undefined>({} as TextareaProps["isInvalid"]);
assertType<boolean | undefined>({} as TextareaProps["isRequired"]);
assertType<boolean | undefined>({} as TextareaProps["isReadOnly"]);

const _size: TextareaProps["size"] = "md";
const _variant: TextareaProps["variant"] = "outline";

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof TextareaProps
        ? "onChangeValue" extends keyof TextareaProps
            ? true
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof TextareaProps
        ? "variant" extends keyof TextareaProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof TextareaProps
        ? "color" extends keyof TextareaProps
            ? "p" extends keyof TextareaProps
                ? "m" extends keyof TextareaProps
                    ? "w" extends keyof TextareaProps
                        ? "h" extends keyof TextareaProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasNoAutoSizeCallbacks = ExpectTrue<
    "onChangeValue" extends keyof TextareaNoAutoSizeProps ? true : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _noAutoSize: _HasNoAutoSizeCallbacks = true;

void (_callbackProps && _recipeProps && _styleProps && _noAutoSize && _size && _variant);

assertType<TextareaProps>({
    onChange: () => {},
    onChangeValue: () => {},
    size: "md",
    variant: "filled",
    name: "bio",
    isInvalid: true,
    className: "custom-textarea",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<TextareaNoAutoSizeProps>({
    onChangeValue: () => {},
    size: "sm",
    variant: "outline"
});

assertType<TextareaProps["onChange"]>(
    // @ts-expect-error onChange must receive a change event, not a string
    (_value: string) => {}
);

assertType<TextareaProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<TextareaProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
