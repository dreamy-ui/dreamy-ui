import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type FlexProperties, flex } from "styled-system/patterns";
import { dreamy, HTMLDreamyProps } from "./factory";

export interface FlexProps
	extends Omit<HTMLDreamyProps<"div">, keyof FlexProperties>,
		FlexProperties {}

const DreamFlex = dreamy.div;

/**
 * Flex component
 *
 * @See Docs https://dreamy-ui.com/docs/components/flex
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
	const [patternProps, restProps] = splitProps(props, [
		"align",
		"justify",
		"direction",
		"wrap",
		"basis",
		"grow",
		"shrink"
	]);

	const styles = flex.raw(patternProps);

	return <DreamFlex ref={ref} {...styles} {...restProps} />;
});
