import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { type TextProperties, text } from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

export interface LinkProps extends HTMLDreamProps<"a">, TextProperties {
    /**
     * Sets `target="_blank"` on the link
     * If `true`, the link will open in a new tab
     */
    isExternal?: boolean;
}

const StyledLink = dreamy.a;

/**
 * Link component
 *
 * @See Docs https://dream-ui.com/docs/components/link
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const { isExternal, ...rest } = props;

    const [patternProps, restProps] = splitProps(rest, ["variant", "size"]);
    const styleProps = text.raw({
        variant: "link",
        ...patternProps
    });

    return (
        <StyledLink
            ref={ref}
            target={isExternal ? "_blank" : undefined}
            {...styleProps}
            {...restProps}
        />
    );
});
