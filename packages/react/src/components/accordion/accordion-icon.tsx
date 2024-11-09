import { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";
import { dream } from "../factory";

export interface AccordionIconProps extends HTMLDreamProps<"svg"> {}

const StyledIcon = styled(dream.svg);

export const AccordionIconBase = forwardRef<SVGSVGElement, AccordionIconProps>(
	function AccordionIcon(props, ref) {
		return (
			<StyledIcon ref={ref} asChild {...props}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</StyledIcon>
		);
	}
);

AccordionIconBase.displayName = "AccordionIcon";
