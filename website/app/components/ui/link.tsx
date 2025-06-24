import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type TextProperties, text } from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface LinkProps extends HTMLDreamyProps<"a">, TextProperties {
    /**
     * Sets `target="_blank"` on the link
     * If `true`, the link will open in a new tab
     */
    isExternal?: boolean;
}

/**
 * Link component
 *
 * @See Docs https://dreamy-ui.com/docs/components/link
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const { isExternal, ...rest } = props;

    const [patternProps, restProps] = splitProps(rest, ["variant", "size"]);
    const styleProps = text.raw({
        variant: "link",
        ...patternProps
    });

    return (
        <dreamy.a
            ref={ref}
            target={isExternal ? "_blank" : undefined}
            {...styleProps}
            {...restProps}
        />
    );
});
