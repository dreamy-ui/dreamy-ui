import { assertType } from "vitest";
import type { FieldProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as FieldProps["isRequired"]);
assertType<boolean | undefined>({} as FieldProps["isInvalid"]);
assertType<boolean | undefined>({} as FieldProps["isDisabled"]);
assertType<boolean | undefined>({} as FieldProps["isReadOnly"]);
assertType<string | undefined>({} as FieldProps["id"]);
assertType<string | undefined>({} as FieldProps["label"]);
assertType<string | undefined>({} as FieldProps["hint"]);
assertType<string | undefined>({} as FieldProps["error"]);

const _orientation: FieldProps["orientation"] = "vertical";

type _HasFeedbackProps = ExpectTrue<
    "isRequired" extends keyof FieldProps
        ? "isInvalid" extends keyof FieldProps
            ? "hint" extends keyof FieldProps
                ? "error" extends keyof FieldProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<"orientation" extends keyof FieldProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof FieldProps
        ? "color" extends keyof FieldProps
            ? "p" extends keyof FieldProps
                ? "m" extends keyof FieldProps
                    ? "w" extends keyof FieldProps
                        ? "h" extends keyof FieldProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _feedbackProps: _HasFeedbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_feedbackProps && _recipeProps && _styleProps && _orientation);

assertType<FieldProps>({
    id: "email",
    label: "Email",
    hint: "Work email",
    error: "Required",
    isRequired: true,
    isInvalid: true,
    isDisabled: false,
    isReadOnly: false,
    orientation: "vertical",
    className: "custom-field",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<FieldProps>({
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});
