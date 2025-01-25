import { Box } from "@/components/box/box";
import { Heading } from "@/components/heading";
import { usePopoverContext } from "@/components/popover/popover-context";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface PopoverHeaderProps extends HTMLDreamProps<"header"> {}

/**
 * PopoverHeader is the accessible header or label
 * for the popover's content, and it is first announced by screen readers.
 */
export const PopoverHeaderBase = forwardRef<HTMLDivElement, PopoverHeaderProps>(
	function PopoverHeader(props, ref) {
		const { children, ...rest } = props;
		const { getHeaderProps } = usePopoverContext();

		return (
			<Box as={"header"} {...getHeaderProps(rest, ref)}>
				{typeof children === "string" ? (
					<Heading variant={"heading"} size="md">
						{children}
					</Heading>
				) : (
					children
				)}
			</Box>
		);
	}
);

PopoverHeaderBase.displayName = "PopoverHeader";
