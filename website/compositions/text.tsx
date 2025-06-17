import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type TextProperties, text } from "styled-system/patterns";
import { dreamy, HTMLDreamyProps } from "./factory";

export interface TextProps extends HTMLDreamyProps<"p">, TextProperties {}

/**
 * Text component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/text
 */
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
	(props, ref) => {
		const [patternProps, restProps] = splitProps(props, [
			"variant",
			"size"
		]);

		const styleProps = text.raw(patternProps);

		return <dreamy.p ref={ref} {...styleProps} {...restProps} />;
	}
);
