import { useFieldContext } from "@/components/field/field-root";
import type { UserFeedbackProps } from "@/components/input";
import { callAllHandlers } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";

export interface UseFieldProps<T extends HTMLElement> extends UserFeedbackProps {
    id?: string;
    onFocus?: React.FocusEventHandler<T>;
    onBlur?: React.FocusEventHandler<T>;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    "aria-describedby"?: string;
}

/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and helper text.
 *
 * @internal
 */
export function useField<T extends HTMLElement>(props: UseFieldProps<T>) {
    const { isDisabled, isInvalid, isReadOnly, isRequired, ...rest } = useFieldProps(props);

    return {
        ...rest,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
        "aria-invalid": ariaAttr(isInvalid),
        "aria-required": ariaAttr(isRequired),
        "aria-readonly": ariaAttr(isReadOnly),
        "data-invalid": dataAttr(isInvalid),
        "data-required": dataAttr(isRequired),
        "data-readonly": dataAttr(isReadOnly)
    };
}

/**
 * @internal
 */
export function useFieldProps<T extends HTMLElement>(props: UseFieldProps<T>) {
    const field = useFieldContext();

    const {
        id,
        disabled,
        readOnly,
        required,
        isRequired,
        isInvalid,
        isReadOnly,
        isDisabled,
        onFocus,
        onBlur,
        ...rest
    } = props;

    const labelIds: string[] = props["aria-describedby"] ? [props["aria-describedby"]] : [];

    // Error message must be described first in all scenarios.
    if (field?.hasFeedbackText && field?.isInvalid) {
        labelIds.push(field.feedbackId);
    }

    if (field?.hasHelpText) {
        labelIds.push(field.helpTextId);
    }

    return {
        ...rest,
        "aria-describedby": labelIds.join(" ") || undefined,
        id: id ?? field?.id,
        isDisabled: disabled ?? isDisabled ?? field?.isDisabled,
        isReadOnly: readOnly ?? isReadOnly ?? field?.isReadOnly,
        isRequired: required ?? isRequired ?? field?.isRequired,
        isInvalid: isInvalid ?? field?.isInvalid,
        onFocus: callAllHandlers(field?.onFocus, onFocus),
        onBlur: callAllHandlers(field?.onBlur, onBlur)
    };
}
