import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type BadgeVariantProps, badge } from "styled-system/recipes";
import { dreamy } from "../factory";

export interface BadgeProps extends HTMLDreamProps<"div">, BadgeVariantProps {}

const DreamBadge = dreamy("div", badge);

/**
 * Badge component
 *
 * @See Docs https://dreamy-ui.com/docs/components/badge
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
	return <DreamBadge ref={ref} {...props} />;
});
