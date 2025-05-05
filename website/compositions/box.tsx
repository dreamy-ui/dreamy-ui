import type { HTMLDreamProps } from "@dreamy-ui/react";
import { dreamy } from "@dreamy-ui/react/rsc";
import { forwardRef } from "react";

export interface BoxProps extends HTMLDreamProps<"div"> {}

const DreamBox = dreamy.div;

/**
 * Box component
 *
 * @See Docs https://dreamy-ui.com/docs/components/box
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <DreamBox
            ref={ref}
            {...props}
        />
    );
});
