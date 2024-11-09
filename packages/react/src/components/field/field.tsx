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
    RequiredIndicatorBase,
    type RequiredIndicatorProps
} from "@/components/field/field-label";
import { type FieldProps, FieldRoot } from "@/components/field/field-root";
import { createStyleContext } from "@/components/style-context";
import { field } from "@dreamy-ui/system/recipes";

const { withProvider, withContext } = createStyleContext(field);

/**
 * Field component
 *
 * @See Docs https://dream-ui.com/docs/components/field
 */
export const Field = withProvider(FieldRoot, "root");
export const FieldLabel = withContext(FieldLabelBase, "label");
export const FieldError = withContext(FieldErrorBase, "error");
export const FieldHelpText = withContext(FieldHelpTextBase, "helpText");
export const FieldErrorIcon = withContext(FieldErrorIconBase, "errorIcon");

export type {
    FieldErrorProps,
    FieldHelpTextProps,
    FieldLabelProps,
    FieldProps,
    RequiredIndicatorProps
};

/**
 * @internal
 */
export const RequiredIndicator = withContext(RequiredIndicatorBase, "requiredIndicator");
