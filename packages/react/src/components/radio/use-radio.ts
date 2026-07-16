import { useCallbackRef } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext, useReducedMotion } from "@/provider";
import { type PropGetter, callAllHandlers, cx, omitDreamyProps } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import { useFocusRing } from "@react-aria/focus";
import {
    type PointerEvent,
    type ReactNode,
    type Ref,
    useCallback,
    useId,
    useMemo,
    useRef,
    useState
} from "react";
import { useSafeLayoutEffect } from "../descendant/utils";
import { type UserFeedbackProps, useFieldProps } from "../field/use-field";
import { useRadioGroupContext } from "./use-radio-group";

interface Props extends Record<string, any> {
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
        isDisabled: isDisabledField = groupContext?.isDisabled ?? false,
        isReadOnly: isReadOnlyField = groupContext?.isReadOnly ?? false,
        isRequired: isRequiredField = groupContext?.isRequired ?? false,
        isInvalid: isInvalidField = groupContext?.isInvalid ?? false,
        id,
        onBlur,
        onFocus,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps(props);

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
        isInvalid = isInvalidField,
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
                ? String(groupContext.value) === String(value)
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
    const [suppressFocusVisible, setSuppressFocusVisible] = useState(false);

    const { isFocusVisible, focusProps } = useFocusRing({
        autoFocus
    });

    const onChangeProp = useCallbackRef(onChange);
    const groupOnChangeProp = useCallbackRef(groupContext?.onChange);

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

            // Call individual radio's onChange with event
            onChangeProp?.(event);

            // Call group's onChange with the radio's value
            groupOnChangeProp?.(value);
        },
        [isReadOnly, isDisabled, isControlled, onChangeProp, groupOnChangeProp, value]
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const getRootProps: PropGetter = useCallback(() => {
        const groupProps = groupContext ? (groupContext.variants ?? {}) : {};

        return {
            ref: domRef,
            "data-disabled": dataAttr(isDisabled),
            "data-checked": dataAttr(isChecked),
            "data-invalid": dataAttr(isInvalid),
            "data-readonly": dataAttr(isReadOnly),
            "data-active": dataAttr(active),
            "data-focus-visible": isCard
                ? dataAttr(isFocusVisible && !suppressFocusVisible)
                : undefined,
            onPointerDown: callAllHandlers(otherProps.onPointerDown, (event: PointerEvent) => {
                setActive(true);
                if (isCard && event.pointerType) {
                    setSuppressFocusVisible(true);
                }
            }),
            onPointerUp: callAllHandlers(otherProps.onPointerUp, () => setActive(false)),
            onPointerLeave: callAllHandlers(otherProps.onPointerLeave, () => setActive(false)),
            onClick: callAllHandlers(props.onClick, () => {
                const input = inputRef.current;
                if (!input) {
                    return;
                }

                input.click();

                if (isCard) {
                    input.focus({ preventScroll: true });
                    return;
                }

                requestAnimationFrame(() => {
                    input.focus({ preventScroll: true });
                });
            }),
            className: cx(className, "group"),
            ...groupProps,
            ...omitDreamyProps(otherProps)
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
        suppressFocusVisible,
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
            onBlur: callAllHandlers(props.onBlur, onBlurProp, () => {
                if (isCard) {
                    setSuppressFocusVisible(false);
                }
            }),
            onFocus: callAllHandlers(props.onFocus, onFocusProp),
            onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown, () => {
                if (isCard) {
                    setSuppressFocusVisible(false);
                }
            }),
            onKeyUp: callAllHandlers(props.onKeyUp, onKeyUp),
            required: isRequired,
            checked: isChecked,
            disabled: isInteractionDisabled,
            readOnly: isReadOnly,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-invalid": ariaAttr(ariaInvalid ? Boolean(ariaInvalid) : isInvalid),
            "aria-describedby": ariaDescribedBy,
            "aria-disabled": ariaAttr(isDisabled),
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
        focusProps,
        isCard
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

export const [RadioCardProvider, useRadioCardContext] = createContext<UseRadioReturn>({
    name: "RadioCardContext",
    strict: false
});
