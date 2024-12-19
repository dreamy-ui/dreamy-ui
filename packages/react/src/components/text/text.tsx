import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { type TextProperties, text } from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

export interface TextProps extends HTMLDreamProps<"p">, TextProperties {}

const StyledText = dreamy.p;

/**
 * Text component.
 *
 * @See Docs https://dream-ui.com/docs/components/text
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
