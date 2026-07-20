"use client";

import { type UseSwitchProps, type UseSwitchThumbProps, useSwitch } from "@dreamy-ui/react";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";
import { MotionBox } from "./motion";
import { VisuallyHiddenInput } from "./visually-hidden";

export interface SwitchProps
    extends UseSwitchProps,
        SwittchVariantProps,
        Omit<HTMLDreamyProps<"label">, keyof UseSwitchProps | keyof SwittchVariantProps> {}

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
    const {
        children,
        icon,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getThumbProps,
        getLabelProps
    } = useSwitch(props);

    const thumbProps: UseSwitchThumbProps = getThumbProps();

    return (
        <StyledSwitch {...getRootProps()}>
            <VisuallyHiddenInput {...getInputProps()} />
            <span {...getWrapperProps()}>
                <MotionBox {...thumbProps}>{icon}</MotionBox>
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledSwitch>
    );
}
