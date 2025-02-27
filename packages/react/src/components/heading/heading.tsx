import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type TextProperties, text } from "styled-system/patterns";

export interface HeadingProps extends HTMLDreamProps<"h3">, TextProperties {}

const StyledHeading = dreamy.h3;

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
        <StyledHeading
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});
