"use client";

import { type UseSwitchProps, useSwitch } from "@dreamy-ui/react";

import { dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";
import { MotionBox } from "./motion";
import { VisuallyHiddenInput } from "./visually-hidden";
export interface SwitchProps
    extends Omit<UseSwitchProps, keyof SwittchVariantProps>,
        SwittchVariantProps {}

const StyledSwitch = dreamy("div", swittch);

/**
 * Switch component
 *
 * @See Docs https://dreamy-ui.com/docs/components/switch
 */
export function Switch(props: SwitchProps) {
    const { ref } = props;
    const {
        children,
        icon,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getThumbProps,
        getLabelProps
    } = useSwitch({ ...props, ref });

    return (
        <StyledSwitch {...getRootProps()}>
            <VisuallyHiddenInput {...getInputProps()} />
            <span {...getWrapperProps()}>
                <MotionBox {...getThumbProps()}>{icon}</MotionBox>
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledSwitch>
    );
}
