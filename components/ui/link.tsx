import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextProperties, text } from "styled-system/patterns";

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
export function Link(props: LinkProps) {
    const { isExternal, ...rest } = props;

    const [patternProps, restProps] = splitProps(rest, ["variant", "size"]);

    const styleProps = text.raw({
        variant: "link",
        ...patternProps
    });

    return (
        <dreamy.a
            target={isExternal ? "_blank" : undefined}
            {...styleProps}
            {...restProps}
        />
    );
}
