"use client";

import { type UseSwitchProps, type UseSwitchThumbProps, useSwitch } from "@dreamy-ui/react";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";
import { MotionBox } from "./motion";
import { VisuallyHiddenInput } from "./visually-hidden";

export interface SwitchProps
    extends Omit<HTMLDreamyProps<"label">, "size" | "onChange" | "ref" | "color">,
        Omit<UseSwitchProps, keyof SwittchVariantProps>,
        SwittchVariantProps {}

const StyledSwitch = dreamy("label", swittch);

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
