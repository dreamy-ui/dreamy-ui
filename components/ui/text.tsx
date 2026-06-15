import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextProperties, text } from "styled-system/patterns";

export interface TextProps extends HTMLDreamyProps<"p">, TextProperties {}

/**
 * Text component
 *
 * @See Docs https://dreamy-ui.com/docs/components/text
 */
export function Text(props: TextProps) {
    const [patternProps, restProps] = splitProps(props, ["variant", "size"]);

    const styleProps = text.raw(patternProps);

    return (
        <dreamy.p
            {...styleProps}
            {...restProps}
        />
    );
}
