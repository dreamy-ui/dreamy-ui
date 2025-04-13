"use client";

import {
    FieldErrorBase,
    FieldErrorIconBase,
    type FieldErrorProps
} from "@/components/field/field-error";
import { FieldHelpTextBase, type FieldHelpTextProps } from "@/components/field/field-help-text";
import {
    FieldLabelBase,
    type FieldLabelProps,
    type RequiredIndicatorProps
} from "@/components/field/field-label";
import { type FieldProps, FieldRoot } from "@/components/field/field-root";

// const { withProvider, withContext } = createStyleContext(field);

/**
 * Field component
 *
 * @See Docs https://dreamy-ui.com/docs/components/field
 */
export const Field = FieldRoot;
export const FieldLabel = FieldLabelBase;
export const FieldError = FieldErrorBase;
export const FieldHelpText = FieldHelpTextBase;
export const FieldErrorIcon = FieldErrorIconBase;

export type {
    FieldErrorProps,
    FieldHelpTextProps,
    FieldLabelProps,
    FieldProps,
    RequiredIndicatorProps
};
