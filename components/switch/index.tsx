"use client";

import { Switch as UiSdkSwitch, SwitchThumb as UiSdkSwitchThumb } from "@ui-sdk/react/switch";
import { dataAttr, useFieldProps } from "@dreamy-ui/react";
import type { MotionProps } from "motion/react";
import { m } from "motion/react";
import { useState } from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";

export interface SwitchProps
    extends SwittchVariantProps,
        Omit<
            HTMLDreamyProps<"label">,
            | "defaultValue"
            | "onChange"
            | "onChangeValue"
            | "isChecked"
            | "defaultChecked"
            | "isDisabled"
            | "isReadOnly"
            | "isRequired"
            | "isIndeterminate"
        >,
        Pick<
            React.ComponentProps<typeof UiSdkSwitch>,
            | "checked"
            | "defaultChecked"
            | "onCheckedChange"
            | "disabled"
            | "readOnly"
            | "required"
            | "name"
            | "value"
            | "form"
            | "controller"
            | "debug"
        > {
    /**
     * Marks the switch as invalid for styling purposes.
     */
    isInvalid?: boolean;
    /**
     * Icon rendered inside the thumb.
     */
    icon?: React.ReactNode;
    /**
     * Motion props applied to the thumb content.
     */
    thumbProps?: MotionProps;
}

const StyledSwitch = dreamy("label", swittch);

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
    const field = useFieldProps(props);

    const {
        children,
        icon,
        thumbProps,
        ref,
        checked,
        defaultChecked,
        onCheckedChange,
        disabled: disabledProp,
        readOnly: readOnlyProp,
        required: requiredProp,
        isInvalid: isInvalidProp,
        name,
        value,
        form,
        controller,
        debug,
        autoFocus,
        tabIndex,
        className,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        onClick,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        ...rest
    } = props;

    const isDisabled = disabledProp ?? field.isDisabled;
    const isReadOnly = readOnlyProp ?? field.isReadOnly;
    const isRequired = requiredProp ?? field.isRequired;
    const isInvalid = isInvalidProp ?? field.isInvalid;
    const isInteractionDisabled = isDisabled || isReadOnly;

    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    return (
        <StyledSwitch
            {...rest}
            ref={ref}
            className={cx("group", className as string)}
            data-active={active ? "" : undefined}
            data-disabled={dataAttr(isDisabled)}
            data-invalid={dataAttr(isInvalid)}
            data-readonly={dataAttr(isReadOnly)}
            data-required={dataAttr(isRequired)}
            onClick={onClick}
            onPointerDown={(event: React.PointerEvent<HTMLLabelElement>) => {
                (onPointerDown as ((e: React.PointerEvent<HTMLLabelElement>) => void) | undefined)?.(
                    event
                );
                if (!isInteractionDisabled) {
                    setIsActive(true);
                }
            }}
            onPointerLeave={(event: React.PointerEvent<HTMLLabelElement>) => {
                (onPointerLeave as ((e: React.PointerEvent<HTMLLabelElement>) => void) | undefined)?.(
                    event
                );
                setIsActive(false);
            }}
            onPointerUp={(event: React.PointerEvent<HTMLLabelElement>) => {
                (onPointerUp as ((e: React.PointerEvent<HTMLLabelElement>) => void) | undefined)?.(
                    event
                );
                setIsActive(false);
            }}
        >
            <UiSdkSwitch
                aria-describedby={field["aria-describedby"]}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                autoFocus={autoFocus}
                checked={checked as boolean | undefined}
                data-part="control"
                data-invalid={dataAttr(isInvalid)}
                debug={debug}
                defaultChecked={defaultChecked}
                disabled={isDisabled}
                form={form}
                id={field.id}
                name={name}
                onBlur={field.onBlur}
                onCheckedChange={onCheckedChange}
                onFocus={field.onFocus}
                readOnly={isReadOnly}
                required={isRequired}
                tabIndex={tabIndex as number | undefined}
                value={value as string | undefined}
                controller={controller}
            >
                <UiSdkSwitchThumb data-part="thumb">
                    {icon != null || thumbProps ? (
                        <m.span
                            data-part="thumb-content"
                            {...thumbProps}
                        >
                            {icon}
                        </m.span>
                    ) : null}
                </UiSdkSwitchThumb>
            </UiSdkSwitch>
            {children ? <span data-part="label">{children as React.ReactNode}</span> : null}
        </StyledSwitch>
    );
}
