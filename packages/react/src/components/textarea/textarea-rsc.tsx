import { textarea } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import type { TextareaNoAutoSizeProps } from "./textarea";

export type TextareaRSCProps = Omit<TextareaNoAutoSizeProps, "onChange" | "onBlur" | "onFocus">;

const StyledTextareaNoAutoSize = dreamy("textarea", textarea);

/**
 * TextareaRSC component.
 *
 * @See Docs https://dream-ui.com/docs/components/textarea
 */
export const TextareaRSC = forwardRef<HTMLTextAreaElement, TextareaRSCProps>((props, ref) => {
    return (
        <StyledTextareaNoAutoSize
            ref={ref}
            {...props}
        />
    );
});
