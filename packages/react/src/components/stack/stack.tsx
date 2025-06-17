import type { HTMLDreamProps } from "@/utils/types";
import React, { forwardRef } from "react";
import { cx } from "styled-system/css";
import { type StackProperties, stack } from "styled-system/patterns";
import { dreamy } from "../factory";

export interface StackProps
	extends Omit<HTMLDreamProps<"div">, keyof StackProperties>,
		StackProperties {
	separator?: React.ReactNode;
}

const StyledStack = dreamy.div;

/**
 * Stack component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
	({ separator, direction = "row", children, className, ...props }, ref) => {
		return (
			<StyledStack
				ref={ref}
				className={cx(
					stack({
						direction,
						alignItems: direction === "row" ? "center" : undefined
					}),
					className
				)}
				{...props}
			>
				{React.Children.map(children, (child, index) => (
					<>
						{child}
						{separator &&
							index <
								React.Children.toArray(children).length - 1 &&
							separator}
					</>
				))}
			</StyledStack>
		);
	}
);
