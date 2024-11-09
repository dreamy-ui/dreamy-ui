import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type BadgeVariantProps, badge } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLDreamProps<"div">, BadgeVariantProps {}

const DreamBadge = styled(dream.div, badge);

/**
 * Badge component
 *
 * @See Docs https://dream-ui.com/docs/components/badge
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
    return (
        <DreamBadge
            ref={ref}
            {...props}
        />
    );
});
