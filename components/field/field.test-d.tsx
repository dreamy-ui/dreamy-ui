import { assertType } from "vitest";
import type { FieldProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<boolean | undefined>({} as FieldProps["required"]);
assertType<boolean | undefined>({} as FieldProps["invalid"]);
assertType<boolean | undefined>({} as FieldProps["disabled"]);
assertType<boolean | undefined>({} as FieldProps["readOnly"]);
assertType<string | undefined>({} as FieldProps["name"]);
assertType<string | undefined>({} as FieldProps["id"]);
assertType<string | undefined>({} as FieldProps["label"]);
assertType<string | undefined>({} as FieldProps["hint"]);
assertType<string | undefined>({} as FieldProps["error"]);

const _orientation: FieldProps["orientation"] = "vertical";

type _HasFeedbackProps = ExpectTrue<
    "required" extends KnownKeys<FieldProps>
        ? "invalid" extends KnownKeys<FieldProps>
            ? "disabled" extends KnownKeys<FieldProps>
                ? "hint" extends KnownKeys<FieldProps>
                    ? "error" extends KnownKeys<FieldProps>
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasNoLegacyProps = ExpectTrue<
    "isRequired" extends KnownKeys<FieldProps>
        ? false
        : "isInvalid" extends KnownKeys<FieldProps>
          ? false
          : "isDisabled" extends KnownKeys<FieldProps>
            ? false
            : "isReadOnly" extends KnownKeys<FieldProps>
              ? false
              : true
>;

type _HasRecipeProps = ExpectTrue<"orientation" extends KnownKeys<FieldProps> ? true : false>;

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
const _noLegacyProps: _HasNoLegacyProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_feedbackProps && _noLegacyProps && _recipeProps && _styleProps && _orientation);

assertType<FieldProps>({
    id: "email",
    name: "email",
    label: "Email",
    hint: "Work email",
    error: "Required",
    required: true,
    invalid: true,
    disabled: false,
    readOnly: false,
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
