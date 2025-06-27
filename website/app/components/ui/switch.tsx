import { type UseSwitchProps, useSwitch } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type SwittchVariantProps, swittch } from "styled-system/recipes";
import { dreamy } from "./factory";
import { MotionBox } from "./motion";
import { VisuallyHiddenInput } from "./visually-hidden";

export interface SwitchProps extends UseSwitchProps, SwittchVariantProps {}

const StyledSwitch = dreamy("div", swittch);

/**
 * Switch component
 *
 * @See Docs https://dreamy-ui.com/docs/components/switch
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
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
                <MotionBox {...(getThumbProps() as any)}>{icon}</MotionBox>
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledSwitch>
    );
});

Switch.displayName = "Switch";
