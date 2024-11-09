import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { flex } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface FlexProps extends HTMLDreamProps<"div"> {}

const DreamFlex = styled(dream.div, flex);

/**
 * Flex component
 *
 * @See Docs https://dream-ui.com/docs/components/flex
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
    return (
        <DreamFlex
            ref={ref}
            {...props}
        />
    );
});
