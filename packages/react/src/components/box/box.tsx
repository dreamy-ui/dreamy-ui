import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";

export interface BoxProps extends HTMLDreamProps<"div"> {}

const DreamBox = styled(dream.div);

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
