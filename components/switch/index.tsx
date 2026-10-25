"use client";

import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import {
    type UseSwitchProps,
    useFieldProps,
    useFocusRing,
    useReducedMotion
} from "@dreamy-ui/react";
import type { MotionProps } from "motion/react";
import { useState } from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";
import { MotionBox } from "../motion";

export interface SwitchProps
    extends UseSwitchProps,
        SwittchVariantProps,
        Omit<HTMLDreamyProps<"label">, keyof UseSwitchProps | keyof SwittchVariantProps> {}

const StyledSwitch = dreamy(ArkSwitch.Root, swittch);

/**
 * Switch component — toggle between two states.
 *
 * @see Docs https://dreamy-ui.com/docs/components/switch
 *
 * @example
 * ```tsx
 * <Switch>Notifications</Switch>
 * ```
 */
export function Switch(props: SwitchProps) {
    const reduceMotionGlobal = useReducedMotion();
    const field = useFieldProps(props);

    const {
        children,
        icon,
        ref,
        isChecked: isCheckedProp,
        defaultChecked,
        isDisabled: isDisabledProp,
        isReadOnly: isReadOnlyProp,
        isRequired: isRequiredProp,
        isInvalid: isInvalidProp,
        isIndeterminate = false,
        reduceMotion = reduceMotionGlobal ?? false,
        onChange,
        onChangeValue,
        name,
        value,
        tabIndex,
        autoFocus,
        inputProps,
        wrapperProps,
        labelProps,
        thumbProps,
        className,
        onClick,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        onBlur,
        onFocus,
        onKeyDown,
        onKeyUp,
        ...rest
    } = props;

    const isDisabled = isDisabledProp ?? field.isDisabled;
    const isReadOnly = isReadOnlyProp ?? field.isReadOnly;
    const isRequired = isRequiredProp ?? field.isRequired;
    const isInvalid = isInvalidProp ?? field.isInvalid;
    const isInteractionDisabled = isDisabled || isReadOnly;

    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    const { isFocusVisible, focusProps } = useFocusRing({ autoFocus });

    const isControlled = isCheckedProp !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(!!defaultChecked);
    const isChecked = isControlled ? isCheckedProp : uncontrolledChecked;

    const checkedProps = isControlled
        ? { checked: isCheckedProp }
        : defaultChecked !== undefined
          ? { defaultChecked }
          : {};

    return (
        <StyledSwitch
            {...rest}
            {...checkedProps}
            className={cx("group", className)}
            data-active={active ? "" : undefined}
            data-checked={isChecked || isIndeterminate ? "" : undefined}
            data-disabled={isDisabled ? "" : undefined}
            data-indeterminate={isIndeterminate ? "" : undefined}
            data-invalid={isInvalid ? "" : undefined}
            data-readonly={isReadOnly ? "" : undefined}
            disabled={isDisabled}
            invalid={isInvalid}
            onCheckedChange={(details) => {
                if (!isControlled) {
                    setUncontrolledChecked(details.checked === true);
                }
                onChangeValue?.(details.checked === true);
                onChange?.({
                    target: { checked: details.checked === true }
                } as React.ChangeEvent<HTMLInputElement>);
            }}
            onClick={onClick}
            onPointerDown={(event) => {
                onPointerDown?.(event);
                if (!isInteractionDisabled) {
                    setIsActive(true);
                }
            }}
            onPointerLeave={(event) => {
                onPointerLeave?.(event);
                setIsActive(false);
            }}
            onPointerUp={(event) => {
                onPointerUp?.(event);
                setIsActive(false);
            }}
            readOnly={isReadOnly}
            required={isRequired}
        >
            <ArkSwitch.HiddenInput
                {...inputProps}
                {...focusProps}
                aria-describedby={inputProps?.["aria-describedby"] ?? field["aria-describedby"]}
                aria-invalid={
                    field.isInvalid ? true : inputProps?.["aria-invalid"]
                }
                autoFocus={autoFocus}
                id={inputProps?.id ?? field.id}
                name={inputProps?.name ?? name}
                onBlur={(event) => {
                    focusProps.onBlur?.(event);
                    field.onBlur?.(event);
                    onBlur?.(event);
                    inputProps?.onBlur?.(event);
                }}
                onFocus={(event) => {
                    focusProps.onFocus?.(event);
                    field.onFocus?.(event);
                    onFocus?.(event);
                    inputProps?.onFocus?.(event);
                }}
                onKeyDown={(event) => {
                    inputProps?.onKeyDown?.(event);
                    onKeyDown?.(event);
                    if (event.key === " " && !isInteractionDisabled) {
                        setIsActive(true);
                    }
                }}
                onKeyUp={(event) => {
                    inputProps?.onKeyUp?.(event);
                    onKeyUp?.(event);
                    if (event.key === " ") {
                        setIsActive(false);
                    }
                }}
                ref={ref}
                required={isRequired}
                role="switch"
                tabIndex={tabIndex}
                value={value}
            />
            <ArkSwitch.Control
                aria-hidden="true"
                data-focus-visible={isFocusVisible ? "" : undefined}
                data-part="control"
                {...wrapperProps}
            >
                <SwitchThumb
                    icon={icon}
                    thumbProps={thumbProps}
                />
            </ArkSwitch.Control>
            {children ? (
                <ArkSwitch.Label
                    data-part="label"
                    {...labelProps}
                >
                    {children}
                </ArkSwitch.Label>
            ) : null}
        </StyledSwitch>
    );
}

interface SwitchThumbProps {
    icon?: React.ReactNode;
    thumbProps?: Partial<MotionProps>;
}

function SwitchThumb(props: SwitchThumbProps) {
    const { icon, thumbProps } = props;

    return (
        <ArkSwitch.Thumb asChild>
            <MotionBox
                data-part="thumb"
                layout={false}
                {...thumbProps}
            >
                {icon}
            </MotionBox>
        </ArkSwitch.Thumb>
    );
}
