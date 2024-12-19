import type { HTMLDreamProps } from "@/utils/types";
import { type BadgeVariantProps, badge } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";

export interface BadgeProps extends HTMLDreamProps<"div">, BadgeVariantProps {}

const DreamBadge = dreamy("div", badge);

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
