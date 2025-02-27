import { forwardRef } from "react";
import { textarea } from "styled-system/recipes";
import { dreamy } from "../factory";
import type { TextareaNoAutoSizeProps } from "./textarea";

export type TextareaRSCProps = Omit<TextareaNoAutoSizeProps, "onChange" | "onBlur" | "onFocus">;

const StyledTextareaNoAutoSize = dreamy("textarea", textarea);

/**
 * TextareaRSC component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/textarea
 */
export const TextareaRSC = forwardRef<HTMLTextAreaElement, TextareaRSCProps>((props, ref) => {
    return (
        <StyledTextareaNoAutoSize
            ref={ref}
            {...props}
        />
    );
});
