import { useCallbackRef } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { useReducedMotion } from "@/provider";
import { type PropGetter, callAll, callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import { useFocusRing } from "@react-aria/focus";
import { type ReactNode, type Ref, useCallback, useId, useMemo, useRef, useState } from "react";
import { useSafeLayoutEffect } from "../descendant/utils";
import { useField } from "../field/use-field";
import type { UserFeedbackProps } from "../input";
import { useRadioGroupContext } from "./radio-group";

interface Props extends HTMLDreamProps<"input"> {
    /**
     * Ref to the DOM node.
     */
    ref?: Ref<HTMLInputElement>;
    /**
     * The label of the Radio.
     */
    children?: ReactNode;
    /**
     * Whether the Radio is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * The value of the radio button
     */
    value?: string | number;
    /**
     * Description for the radio button
     */
    description?: ReactNode;
}

export interface UseRadioProps extends Props, UserFeedbackProps {
    isCard?: boolean;
    reduceMotion?: boolean;
    isIndeterminate?: boolean;
    isChecked?: boolean;
    defaultChecked?: boolean;
}

export function useRadio(props: UseRadioProps = {}) {
    const reduceMotionGlobal = useReducedMotion();
    const groupContext = useRadioGroupContext();

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
        name,
        autoFocus = false,
        isChecked: isCheckedProp,
        reduceMotion = groupContext?.reduceMotion ?? reduceMotionGlobal ?? false,
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
        isCard = false,
        description,
        ...otherProps
    } = props;

    const [checkedState, setCheckedState] = useState(!!defaultChecked);

    const isControlled = useMemo(() => isCheckedProp !== undefined, [isCheckedProp]);
    const isChecked = useMemo(
        () =>
            groupContext
                ? groupContext.value === value
                : isControlled
                  ? isCheckedProp
                  : checkedState,
        [groupContext, isCheckedProp, value, checkedState, isControlled]
    );

    const domRef = useRef<HTMLLabelElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const reactId = useId();
    const labelId = useMemo(() => id || reactId, [id, reactId]);

    const isInteractionDisabled = useMemo(() => isDisabled || isReadOnly, [isDisabled, isReadOnly]);

    const [isActive, setActive] = useState(false);
    const active = useMemo(
        () => isActive && !isInteractionDisabled,
        [isActive, isInteractionDisabled]
    );

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
                setCheckedState(true);
            }

            setActive(false);
            onChangeProp?.(event);
        },
        [isReadOnly, isDisabled, isControlled, onChangeProp]
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
            "data-checked": dataAttr(isChecked),
            "data-invalid": dataAttr(isInvalid),
            "data-readonly": dataAttr(isReadOnly),
            "data-active": dataAttr(active),
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
        isInvalid,
        isReadOnly,
        className,
        props.onClick,
        isCard,
        isFocusVisible,
        groupContext,
        active,
        ...objectToDeps(otherProps)
    ]);

    const getWrapperProps: PropGetter = useCallback(
        (props = {}) => {
            return {
                ...props,
                "data-part": "wrapper",
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
                (event.target as any).checked = true;
                handleChange(event as any);
            }
        },
        [handleChange]
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
            type: "radio",
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
            ...(focusProps as any)
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
            htmlFor: labelId,
            "data-part": "label"
        }),
        [labelId]
    );

    const getControlProps: PropGetter = useCallback(
        (props = {}) => ({
            ...props,
            "data-part": "control"
        }),
        []
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
        children,
        isChecked,
        isDisabled,
        isInvalid,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getControlProps,
        getLabelProps,
        description,
        active
    };
}

export type UseRadioReturn = ReturnType<typeof useRadio>;
