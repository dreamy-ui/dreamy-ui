import { forwardRef } from "react";
import { type BadgeVariantProps, badge } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";

export interface BadgeProps extends HTMLDreamyProps<"div">, BadgeVariantProps {}

const DreamyBadge = dreamy("div", badge);

/**
 * Badge component
 *
 * @See Docs https://dreamy-ui.com/docs/components/badge
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
    return (
        <DreamyBadge
            ref={ref}
            {...props}
        />
    );
});
