import { type RadioVariantProps, radio } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import { VisuallyHiddenInput } from "../visually-hidden";
import { type UseRadioProps, useRadio } from "./use-radio";

export interface RadioProps extends UseRadioProps, RadioVariantProps {}

const StyledRadio = dreamy("div", radio);

/**
 * Radio component
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
    const {
        children,
        getRootProps,
        getWrapperProps,
        getControlProps,
        getInputProps,
        getLabelProps
    } = useRadio({ ...props, ref });

    return (
        <StyledRadio {...(getRootProps() as any)}>
            <VisuallyHiddenInput {...(getInputProps() as any)} />
            <span {...getWrapperProps()}>
                <span {...getControlProps()} />
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledRadio>
    );
});

Radio.displayName = "Radio";
