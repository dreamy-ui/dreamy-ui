import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type TextVariantProps, text } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface TextProps extends HTMLDreamProps<"p">, TextVariantProps {}

const StyledText = styled(dream.p, text);

/**
 * Text component.
 *
 * @See Docs https://dream-ui.com/docs/components/text
 */
export const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
    return (
        <StyledText
            ref={ref}
            {...props}
        />
    );
});
