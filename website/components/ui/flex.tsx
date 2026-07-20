import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type FlexProperties, flex } from "styled-system/patterns";

export interface FlexProps
    extends Omit<HTMLDreamyProps<"div">, keyof FlexProperties>,
        FlexProperties {}

/**
 * Flex component — flexbox layout container.
 *
 * @see Docs https://dreamy-ui.com/docs/components/flex
 *
 * @example
 * ```tsx
 * <Flex gap="4" align="center">
 *   <Box>Item</Box>
 * </Flex>
 * ```
 */
export function Flex(props: FlexProps) {
    const [patternProps, restProps] = splitProps(props, [
        "align",
        "justify",
        "direction",
        "wrap",
        "basis",
        "grow",
        "shrink"
    ]);

    const styles = flex.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        />
    );
}
