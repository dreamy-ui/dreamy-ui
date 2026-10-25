import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type TextProperties, text } from "styled-system/patterns";

export interface HeadingProps extends HTMLDreamyProps<"h3">, TextProperties {}

/**
 * Heading component — semantic heading with typographic styles.
 *
 * @see Docs https://dreamy-ui.com/docs/components/heading
 *
 * @example
 * ```tsx
 * <Heading size="lg">Title</Heading>
 * ```
 */
export function Heading(props: HeadingProps) {
    const [patternProps, restProps] = splitProps(props, ["variant", "size"]);

    return (
        <dreamy.h3
            className={text({
                variant: "heading",
                ...patternProps
            })}
            {...restProps}
        />
    );
}
