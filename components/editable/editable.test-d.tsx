import type { ChangeDetails } from "@ui-sdk/core";
import { assertType } from "vitest";
import type {
    EditableActivationMode,
    EditableEditButtonProps,
    EditableEditingChangeReason,
    EditableInputProps,
    EditablePreviewProps,
    EditableProps,
    EditableSubmitMode,
    EditableValueChangeReason
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<
    ((nextValue: string, details: ChangeDetails<EditableValueChangeReason>) => void) | undefined
>({} as EditableProps["onValueChange"]);
assertType<((nextValue: string) => void) | undefined>({} as EditableProps["onValueCommit"]);
assertType<((previousValue: string) => void) | undefined>({} as EditableProps["onValueRevert"]);
assertType<
    ((editing: boolean, details: ChangeDetails<EditableEditingChangeReason>) => void) | undefined
>({} as EditableProps["onEditingChange"]);
assertType<string | undefined>({} as EditableProps["value"]);
assertType<string | undefined>({} as EditableProps["defaultValue"]);
assertType<boolean | undefined>({} as EditableProps["disabled"]);
assertType<EditableActivationMode | undefined>({} as EditableProps["activationMode"]);
assertType<EditableSubmitMode | undefined>({} as EditableProps["submitMode"]);
assertType<EditableProps["variant"]>({} as EditableProps["variant"]);

type _HasCallbackProps = ExpectTrue<
    "onValueChange" extends KnownKeys<EditableProps>
        ? "onValueCommit" extends KnownKeys<EditableProps>
            ? "onValueRevert" extends KnownKeys<EditableProps>
                ? "onEditingChange" extends KnownKeys<EditableProps>
                    ? true
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "onChange" extends KnownKeys<EditableProps>
        ? false
        : "isDisabled" extends KnownKeys<EditableProps>
          ? false
          : "isEditing" extends KnownKeys<EditableProps>
            ? false
            : "useDoubleClick" extends KnownKeys<EditableProps>
              ? false
              : "submitOnBlur" extends KnownKeys<EditableProps>
                ? false
                : true
>;

assertType<string | undefined>({} as EditablePreviewProps["className"]);
assertType<string | undefined>({} as EditableInputProps["className"]);
assertType<string | undefined>({} as EditableEditButtonProps["className"]);

const _callbackProps: _HasCallbackProps = true;
const _noLegacyProps: _NoLegacyProps = true;

void (_callbackProps && _noLegacyProps);

assertType<EditableProps>({
    onValueChange: () => {},
    onValueCommit: () => {},
    onValueRevert: () => {},
    onEditingChange: () => {},
    value: "Ada",
    defaultValue: "Ada",
    disabled: false,
    activationMode: "dblclick",
    submitMode: "enter",
    placeholder: "Enter a name",
    className: "custom-editable",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<EditableProps>({
    // @ts-expect-error activationMode must be focus | dblclick | none
    activationMode: "hover"
});
