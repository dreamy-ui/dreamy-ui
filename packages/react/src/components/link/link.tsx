import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type TextVariantProps, text } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface LinkProps extends HTMLDreamProps<"a">, TextVariantProps {
    /**
     * Sets `target="_blank"` on the link
     * If `true`, the link will open in a new tab
     */
    isExternal?: boolean;
}

const StyledLink = styled(dream.a, text);

/**
 * Link component
 *
 * @See Docs https://dream-ui.com/docs/components/link
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const { isExternal, ...rest } = props;

    return (
        <StyledLink
            ref={ref}
            variant={"link"}
            target={isExternal ? "_blank" : undefined}
            {...rest}
        />
    );
});
