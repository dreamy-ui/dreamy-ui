import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type TextProperties, text } from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

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
