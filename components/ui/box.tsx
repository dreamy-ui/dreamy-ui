import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface BoxProps extends HTMLDreamyProps<"div"> {}

/**
 * Box component
 *
 * @See Docs https://dreamy-ui.com/docs/components/box
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <dreamy.div
            ref={ref}
            {...props}
        />
    );
});
