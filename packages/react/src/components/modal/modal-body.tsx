import { Flex, type FlexProps } from "@/components/flex/flex";
import { useModalContext } from "@/components/modal/modal-root";
import { forwardRef } from "react";

export interface ModalBodyProps extends FlexProps {}

export const ModalBodyBase = forwardRef<HTMLDivElement, ModalBodyProps>(
	({ children, style, ...props }, ref) => {
		const { scrollBehavior } = useModalContext();

		return (
			<Flex
				ref={ref}
				{...props}
				style={{
					maxHeight:
						scrollBehavior === "inside"
							? "calc(100vh - 10rem)"
							: undefined,
					overflow: scrollBehavior === "inside" ? "auto" : undefined,
					...style
				}}
			>
				{children}
			</Flex>
		);
	}
);
