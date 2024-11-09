import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type TextVariantProps, text } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface HeadingProps extends HTMLDreamProps<"h3">, TextVariantProps {}

const StyledHeading = styled(dream.h3, text);

/**
 * Heading component
 *
 * @See Docs https://dream-ui.com/docs/components/heading
 */
export const Heading = forwardRef<HTMLParagraphElement, HeadingProps>((props, ref) => {
    return (
        <StyledHeading
            variant={"heading"}
            size={"2xl"}
            ref={ref}
            {...props}
        />
    );
});
