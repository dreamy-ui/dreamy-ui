"use client";

import {
    Switch as UiSdkSwitch,
    SwitchThumb as UiSdkSwitchThumb,
    createSwitchController,
    type SwitchController,
    type SwitchState,
    type SwitchThumbState
} from "@ui-sdk/react/switch";
import { type DreamyHostProps, dataAttr, useFieldProps } from "@dreamy-ui/react";
import type { FocusEvent } from "react";
import type { MotionProps } from "motion/react";
import { m } from "motion/react";
import { useState } from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";

type UiSdkSwitchPickedProps = Pick<
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
>;

export interface SwitchProps
    extends SwittchVariantProps,
        DreamyHostProps<
            HTMLDreamyProps<"label">,
            UiSdkSwitchPickedProps,
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
        UiSdkSwitchPickedProps {
    /**
     * Marks the switch as invalid for styling purposes.
     */
    isInvalid?: boolean;
    /**
     * Disables switch thumb motion animation.
     */
    reduceMotion?: boolean;
    /**
     * Icon rendered inside the thumb, or a render function receiving thumb state.
     */
    icon?: React.ReactNode | ((state: SwitchThumbState) => React.ReactNode);
    /**
     * Motion props applied to the thumb content.
     */
    thumbProps?: MotionProps;
}

export { createSwitchController };
export type { SwitchController, SwitchState, SwitchThumbState };

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
        "aria-busy": ariaBusy,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        onClick,
        onPointerCancel,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        reduceMotion: _reduceMotion,
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
            onPointerCancel={(event: React.PointerEvent<HTMLLabelElement>) => {
                (
                    onPointerCancel as
                        | ((e: React.PointerEvent<HTMLLabelElement>) => void)
                        | undefined
                )?.(event);
                setIsActive(false);
            }}
            onPointerDown={(event: React.PointerEvent<HTMLLabelElement>) => {
                (onPointerDown as ((e: React.PointerEvent<HTMLLabelElement>) => void) | undefined)?.(
                    event
                );
                if (!isInteractionDisabled && (event.button == null || event.button === 0)) {
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
                aria-busy={ariaBusy}
                aria-describedby={field["aria-describedby"]}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                autoFocus={autoFocus}
                checked={checked}
                data-part="control"
                data-invalid={dataAttr(isInvalid)}
                debug={debug}
                defaultChecked={defaultChecked}
                disabled={isDisabled}
                form={form}
                id={field.id}
                name={name}
                onBlur={(event: FocusEvent<HTMLButtonElement>) => {
                    field.onBlur?.(event as unknown as FocusEvent<HTMLLabelElement>);
                    setIsActive(false);
                }}
                onCheckedChange={onCheckedChange}
                onFocus={(event: FocusEvent<HTMLButtonElement>) => {
                    field.onFocus?.(event as unknown as FocusEvent<HTMLLabelElement>);
                }}
                onKeyDown={(event) => {
                    if (event.key === " " && !isInteractionDisabled) {
                        setIsActive(true);
                    }
                }}
                onKeyUp={(event) => {
                    if (event.key === " ") {
                        setIsActive(false);
                    }
                }}
                readOnly={isReadOnly}
                required={isRequired}
                tabIndex={tabIndex as number | undefined}
                value={value as string | undefined}
                controller={controller}
            >
                <UiSdkSwitchThumb data-part="thumb">
                    {(state) => {
                        const resolvedIcon = typeof icon === "function" ? icon(state) : icon;
                        return resolvedIcon != null || thumbProps ? (
                            <m.span
                                data-part="thumb-content"
                                {...thumbProps}
                            >
                                {resolvedIcon}
                            </m.span>
                        ) : null;
                    }}
                </UiSdkSwitchThumb>
            </UiSdkSwitch>
            {children ? <span data-part="label">{children as React.ReactNode}</span> : null}
        </StyledSwitch>
    );
}
