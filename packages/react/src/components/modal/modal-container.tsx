import { Box } from "@/components/box/box";
import type { MotionFlexProps } from "@/components/flex";
import { useModalContext } from "@/components/modal/modal-root";
import { forwardRef } from "react";

export interface ModalContainerProps extends MotionFlexProps {}

export const ModalContainerBase = forwardRef<HTMLDivElement, MotionFlexProps>(
	({ children, ...props }, ref) => {
		const { getDialogContainerProps } = useModalContext();

		// @ts-expect-error
		return <Box {...getDialogContainerProps(props, ref)}>{children}</Box>;
	}
);
