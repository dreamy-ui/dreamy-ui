import { styled } from "@dreamy-ui/system/jsx";
import { textarea } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dream } from "../factory";
import type { TextareaNoAutoSizeProps } from "./textarea";

export type TextareaRSCProps = Omit<TextareaNoAutoSizeProps, "onChange" | "onBlur" | "onFocus">;

const StyledTextareaNoAutoSize = styled(dream.textarea, textarea);

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
