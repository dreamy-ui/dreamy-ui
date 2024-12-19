import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { type TextProperties, text } from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

export interface HeadingProps extends HTMLDreamProps<"h3">, TextProperties {}

const StyledHeading = dreamy.h3;

/**
 * Heading component
 *
 * @See Docs https://dream-ui.com/docs/components/heading
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
