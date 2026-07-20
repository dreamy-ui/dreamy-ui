import { splitProps } from "@dreamy-ui/react/rsc";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type WrapProperties, wrap } from "styled-system/patterns/wrap";

export interface WrapProps
    extends Omit<HTMLDreamyProps<"div">, keyof WrapProperties>,
        WrapProperties {}

/**
 * Wrap component — flex container that wraps children.
 *
 * @see Docs https://dreamy-ui.com/docs/components/wrap
 *
 * @example
 * ```tsx
 * <Wrap gap="2">
 *   <Badge>One</Badge>
 *   <Badge>Two</Badge>
 * </Wrap>
 * ```
 */
export function Wrap(props: WrapProps) {
    const [patternProps, restProps] = splitProps(props, [
        "gap",
        "rowGap",
        "columnGap",
        "align",
        "justify"
    ]);

    const styles = wrap.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        />
    );
}
