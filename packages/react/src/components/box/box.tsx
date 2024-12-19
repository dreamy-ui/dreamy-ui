import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface BoxProps extends HTMLDreamProps<"div"> {}

const DreamBox = dreamy.div;

/**
 * Box component
 *
 * @See Docs https://dream-ui.com/docs/components/box
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <DreamBox
            ref={ref}
            {...props}
        />
    );
});
