import { useCallbackRef } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, callAll, callAllHandlers } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import { useFocusRing } from "@react-aria/focus";
import { type ReactNode, type Ref, useCallback, useId, useMemo, useRef, useState } from "react";
import { useSafeLayoutEffect } from "../descendant/utils";
import { useField } from "../field/use-field";
import type { UserFeedbackProps } from "../input";
import { useCheckboxGroupContext } from "./checkbox-group";
import type { IconCustomProps } from "./checkbox-icon";

export type CheckboxIconProps = {
    "data-checked": string;
    isSelected: boolean;
    isIndeterminate: boolean;
    reduceMotion: boolean;
};

interface Props extends HTMLDreamProps<"input">, IconCustomProps {
    /**
     * Ref to the DOM node.
     */
    ref?: Ref<HTMLInputElement>;
    /**
     * The label of the checkbox.
     */
    children?: ReactNode;
    /**
     * Whether the checkbox is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * The icon to be displayed when the checkbox is checked.
     */
    icon?: ReactNode | ((props: CheckboxIconProps) => ReactNode);
}

export interface UseCheckboxProps extends Props, UserFeedbackProps {
    isCard?: boolean;
    reduceMotion?: boolean;
    isIndeterminate?: boolean;
    isChecked?: boolean;
    defaultChecked?: boolean;
}

export function useCheckbox(props: UseCheckboxProps = {}) {
    const reduceMotionGlobal = useReducedMotion();
    const groupContext = useCheckboxGroupContext();

    const {
        disabled: isDisabledField = groupContext?.isDisabled ?? false,
        readOnly: isReadOnlyField = groupContext?.isReadOnly ?? false,
        required: isRequiredField = groupContext?.isRequired ?? false,
        id,
        onBlur,
        onFocus,
        "aria-describedby": ariaDescribedByField
    } = useField(props);

    const onBlurProp = useCallbackRef(onBlur);
    const onFocusProp = useCallbackRef(onFocus);

    const {
        ref,
        value = "",
        children,
        icon,
        name,
        autoFocus = false,
        isChecked: isCheckedProp,
        reduceMotion = groupContext?.reduceMotion ?? reduceMotionGlobal ?? false,
        isIndeterminate = false,
        isDisabled = isDisabledField,
        isReadOnly = isReadOnlyField,
        isInvalid = false,
        className,
        isRequired = isRequiredField,
        defaultChecked,
        onChange,
        tabIndex,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-invalid": ariaInvalid,
        "aria-describedby": ariaDescribedBy = ariaDescribedByField,
        animationTime,
        pathProps,
        isCard = false,
        ...otherProps
    } = props;

    const [checkedState, setCheckedState] = useState(!!defaultChecked);

    const isControlled = isCheckedProp !== undefined;
    const isChecked = groupContext
        ? (groupContext.value?.includes(value as any) ?? false)
        : isControlled
          ? isCheckedProp
          : checkedState;

    const domRef = useRef<HTMLLabelElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const reactId = useId();
    const labelId = useMemo(() => id || reactId, [id, reactId]);

    const isInteractionDisabled = useMemo(() => isDisabled || isReadOnly, [isDisabled, isReadOnly]);

    const [isActive, setActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    const { isFocusVisible, focusProps } = useFocusRing({
        autoFocus
    });

    const onChangeProp = useCallbackRef(callAll(onChange, groupContext?.onChange));

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isReadOnly || isDisabled) {
                event.preventDefault();
                return;
            }

            if (!isControlled) {
                if (isChecked) {
                    setCheckedState(event.target.checked);
                } else {
                    setCheckedState(isIndeterminate ? true : event.target.checked);
                }
            }

            setActive(false);

            onChangeProp?.(event);
        },
        [isReadOnly, isDisabled, isChecked, isControlled, isIndeterminate, onChangeProp]
    );

    const getRootProps: PropGetter = useCallback(() => {
        const groupProps = groupContext
            ? {
                  variant: groupContext.variant,
                  size: groupContext.size,
                  scheme: groupContext.scheme
              }
            : {};

        return {
            ref: domRef,
            "data-disabled": dataAttr(isDisabled),
            "data-checked": dataAttr(isChecked || isIndeterminate),
            "aria-checked": ariaAttr(isChecked || isIndeterminate),
            "data-invalid": dataAttr(isInvalid),
            "data-readonly": dataAttr(isReadOnly),
            "data-indeterminate": dataAttr(isIndeterminate),
            "data-focus-visible": isCard ? dataAttr(isFocusVisible) : undefined,
            onPointerDown: callAllHandlers(otherProps.onPointerDown, () => setActive(true)),
            onPointerUp: callAllHandlers(otherProps.onPointerUp, () => setActive(false)),
            onPointerLeave: callAllHandlers(otherProps.onPointerLeave, () => setActive(false)),
            onClick: callAllHandlers(props.onClick, () => {
                inputRef.current?.click();
                requestAnimationFrame(() => {
                    inputRef.current?.focus({ preventScroll: true });
                });
            }),
            className: cx(className, "group"),
            ...groupProps,
            ...otherProps
        };
    }, [
        isDisabled,
        isChecked,
        isIndeterminate,
        isInvalid,
        isReadOnly,
        className,
        props.onClick,
        isCard,
        isFocusVisible,
        groupContext,
        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        otherProps
    ]);

    const getWrapperProps: PropGetter = useCallback(
        (props = {}) => {
            return {
                ...props,
                "data-part": "control",
                "data-focus-visible": isCard ? undefined : dataAttr(isFocusVisible),
                "aria-hidden": true
            };
        },
        [isFocusVisible, isCard]
    );

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === " ") {
                setActive(true);
            } else if (event.key === "Enter") {
                /**
                 * Mark the checked state as the opposite of the current state
                 */
                (event.target as any).checked = !isChecked;
                handleChange(event as any);
            }
        },
        [handleChange, isChecked]
    );

    const onKeyUp = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === " ") {
                setActive(false);
                handleChange(event as any);
            }
        },
        [handleChange]
    );

    const getInputProps: PropGetter = useCallback(() => {
        return {
            ref: mergeRefs(inputRef, ref),
            type: "checkbox",
            name,
            value,
            id: labelId,
            tabIndex,
            onChange: handleChange,
            onBlur: callAllHandlers(props.onBlur, onBlurProp),
            onFocus: callAllHandlers(props.onFocus, onFocusProp),
            onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
            onKeyUp: callAllHandlers(props.onKeyUp, onKeyUp),
            required: isRequired,
            checked: isChecked,
            disabled: isInteractionDisabled,
            readOnly: isReadOnly,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
            "aria-describedby": ariaDescribedBy,
            "aria-disabled": isDisabled,
            className: "peer",
            ...focusProps
        };
    }, [
        handleChange,
        ref,
        isDisabled,
        isReadOnly,
        isInvalid,
        isInteractionDisabled,
        labelId,
        name,
        props.onBlur,
        props.onFocus,
        props.onKeyDown,
        props.onKeyUp,
        isChecked,
        isRequired,
        ariaLabel,
        ariaLabelledBy,
        ariaInvalid,
        ariaDescribedBy,
        onBlurProp,
        onFocusProp,
        tabIndex,
        value,
        onKeyDown,
        onKeyUp,
        focusProps
    ]);

    const getLabelProps: PropGetter = useCallback(
        () => ({
            id: labelId,
            "data-part": "label"
        }),
        [labelId]
    );

    const getIconProps: PropGetter = useCallback(
        () => ({
            isChecked,
            active,
            isIndeterminate,
            reduceMotion,
            animationTime,
            pathProps,
            "data-part": "icon"
        }),
        [isChecked, isIndeterminate, reduceMotion, active, animationTime, pathProps]
    );

    useSafeLayoutEffect(() => {
        const el = inputRef.current;
        if (!el?.form) return;
        const formResetListener = () => {
            setCheckedState(!!defaultChecked);
        };
        el.form.addEventListener("reset", formResetListener);
        return () => el.form?.removeEventListener("reset", formResetListener);
    }, []);

    return {
        icon,
        children,
        isChecked,
        isDisabled,
        isInvalid,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getIconProps
    };
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>;
