import { assertType } from "vitest";
import type {
    EditableEditButtonProps,
    EditableInputProps,
    EditablePreviewProps,
    EditableProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<((nextValue: string) => void) | undefined>({} as EditableProps["onChange"]);
assertType<((nextValue: string) => void) | undefined>({} as EditableProps["onSubmit"]);
assertType<((previousValue: string) => void) | undefined>({} as EditableProps["onCancel"]);
assertType<(() => void) | undefined>({} as EditableProps["onEdit"]);
assertType<string | undefined>({} as EditableProps["value"]);
assertType<string | undefined>({} as EditableProps["defaultValue"]);
assertType<boolean | undefined>({} as EditableProps["isDisabled"]);
assertType<boolean | undefined>({} as EditableProps["useDoubleClick"]);
assertType<boolean | undefined>({} as EditableProps["isPreviewFocusable"]);
assertType<boolean | undefined>({} as EditableProps["submitOnBlur"]);

type _HasCallbackProps = ExpectTrue<
    "onChange" extends keyof EditableProps
        ? "onSubmit" extends keyof EditableProps
            ? "onCancel" extends keyof EditableProps
                ? "onEdit" extends keyof EditableProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof EditableProps
        ? "color" extends keyof EditableProps
            ? "p" extends keyof EditableProps
                ? "m" extends keyof EditableProps
                    ? "w" extends keyof EditableProps
                        ? "h" extends keyof EditableProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    "className" extends keyof EditablePreviewProps
        ? "className" extends keyof EditableInputProps
            ? "className" extends keyof EditableEditButtonProps
                ? true
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _styleProps && _partProps);

assertType<EditableProps>({
    onChange: () => {},
    onSubmit: () => {},
    onCancel: () => {},
    onEdit: () => {},
    value: "Ada",
    defaultValue: "Ada",
    isDisabled: false,
    useDoubleClick: false,
    isPreviewFocusable: true,
    submitOnBlur: true,
    placeholder: "Enter a name",
    className: "custom-editable",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<EditableProps["onChange"]>(
    // @ts-expect-error onChange receives the next string value, not a boolean
    (_value: boolean) => {}
);

assertType<EditableProps>({
    // @ts-expect-error useDoubleClick must be a boolean
    useDoubleClick: "yes"
});
