import { Box } from "@/components/box/box";
import type { HTMLDreamProps } from "@/utils/types";

export interface PopoverArrowProps extends HTMLDreamProps<"div"> {}

export function PopoverArrow(props: PopoverArrowProps) {
	return (
		<Box
			data-popper-arrow
			style={{
				backgroundColor: "transparent"
			}}
		>
			<Box data-popper-arrow-inner {...props} />
		</Box>
	);
}

PopoverArrow.displayName = "PopoverArrow";
