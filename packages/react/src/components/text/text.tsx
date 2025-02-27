import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type TextProperties, text } from "styled-system/patterns";

export interface TextProps extends HTMLDreamProps<"p">, TextProperties {}

const StyledText = dreamy.p;

/**
 * Text component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/text
 */
export const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, ["variant", "size"]);

    const styleProps = text.raw(patternProps);

    return (
        <StyledText
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});
