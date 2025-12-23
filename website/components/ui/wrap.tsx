import { splitProps } from "@dreamy-ui/react/rsc";
import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import type { WrapProperties } from "styled-system/patterns";
import { wrap } from "styled-system/patterns/wrap";

export interface WrapProps
    extends Omit<HTMLDreamyProps<"div">, keyof WrapProperties>,
        WrapProperties {}

/**
 * Wrap component
 *
 * @See Docs https://dreamy-ui.com/docs/components/wrap
 */
export const Wrap = forwardRef<HTMLDivElement, WrapProps>((props, ref) => {
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
            ref={ref}
            {...styles}
            {...restProps}
        />
    );
});
