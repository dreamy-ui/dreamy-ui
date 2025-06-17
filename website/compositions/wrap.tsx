import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import type { WrapProperties } from "styled-system/patterns";
import { wrap } from "styled-system/patterns/wrap";
import { dreamy, HTMLDreamyProps } from "./factory";

export interface WrapProps
	extends Omit<HTMLDreamyProps<"div">, keyof WrapProperties>,
		WrapProperties {}

/**
 * Wrap component
 *
 * @See Docs https://dreamy-ui.com/docs/components/wrap
 */
export const Wrap = forwardRef<HTMLDivElement, WrapProps>((props, ref) => {
	const [patternProps, restProps] = splitProps(props, [
		"gap",
		"rowGap",
		"columnGap",
		"align",
		"justify"
	]);

	const styles = wrap.raw(patternProps);

	return <dreamy.div ref={ref} {...styles} {...restProps} />;
});
