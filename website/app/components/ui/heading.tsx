import { splitProps } from "@dreamy-ui/react/rsc";
import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextProperties, text } from "styled-system/patterns";

export interface HeadingProps extends HTMLDreamyProps<"h3">, TextProperties {}

/**
 * Heading component
 *
 * @See Docs https://dreamy-ui.com/docs/components/heading
 */
export const Heading = forwardRef<HTMLParagraphElement, HeadingProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, ["variant", "size"]);

    const styleProps = text.raw({
        variant: "heading",
        ...patternProps
    });

    return (
        <dreamy.h3
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});
