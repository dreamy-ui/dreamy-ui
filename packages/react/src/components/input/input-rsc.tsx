import { input } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import type { InputProps } from "./input";

export interface InputRSCProps extends Omit<InputProps, "onChange" | "onFocus" | "onBlur"> {}

const StyledInput = dreamy("input", input);

/**
 * RSC compatible version of Input component.
 * Lacks of field and input group context.
 *
 * @See Docs https://dream-ui.com/docs/components/input
 */
export const InputRSC = forwardRef<HTMLInputElement, InputRSCProps>((props, ref) => {
    return (
        <StyledInput
            ref={ref}
            {...props}
        />
    );
});
