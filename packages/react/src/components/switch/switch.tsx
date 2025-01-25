import { runIfFn } from "@/utils/run-if-fn";
import { type SwitchRecipeVariantProps, switchRecipe } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { MotionBox } from "../box";
import { dreamy } from "../factory";
import { VisuallyHiddenInput } from "../visually-hidden";
import { type UseSwitchProps, useSwitch } from "./use-switch";

export interface SwitchProps extends UseSwitchProps, SwitchRecipeVariantProps {}

const StyledSwitch = dreamy("div", switchRecipe);

/**
 * Switch component
 *
 * @See Docs https://dreamy-ui.com/docs/components/Switch
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
        <StyledSwitch {...(getRootProps() as any)}>
            <VisuallyHiddenInput {...(getInputProps() as any)} />
            <span {...getWrapperProps()}>
                <MotionBox {...(getThumbProps() as any)}>{runIfFn(icon as any)}</MotionBox>
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledSwitch>
    );
});

Switch.displayName = "Switch";
