import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type DividerVariantProps, divider } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface DividerProps extends HTMLDreamProps<"hr">, DividerVariantProps {}

const DreamDivider = styled(dream.hr, divider);

/**
 * Divider component
 *
 * @See Docs https://dream-ui.com/docs/components/divider
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
    return (
        <DreamDivider
            ref={ref}
            {...props}
        />
    );
});
