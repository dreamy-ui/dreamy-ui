import { Flex, type FlexProps } from "@/components/flex";
import { forwardRef } from "react";

export interface ModalFooterProps extends FlexProps {}

export const ModalFooterBase = forwardRef<HTMLDivElement, ModalFooterProps>(
	({ children, ...props }, ref) => {
		return (
			<Flex as={"footer"} {...props} ref={ref}>
				{children}
			</Flex>
		);
	},
);
