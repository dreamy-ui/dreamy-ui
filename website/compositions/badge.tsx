import { forwardRef } from "react";
import { badge, type BadgeVariantProps } from "styled-system/recipes";
import { dreamy, type HTMLDreamyProps } from "./factory";

export interface BadgeProps extends HTMLDreamyProps<"div">, BadgeVariantProps {}

const DreamyBadge = dreamy("div", badge);

/**
 * Badge component
 *
 * @See Docs https://dreamy-ui.com/docs/components/badge
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
	return <DreamyBadge ref={ref} {...props} />;
});
