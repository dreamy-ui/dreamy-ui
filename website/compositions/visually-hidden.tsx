import { splitProps } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { visuallyHidden } from "styled-system/patterns";
import { dreamy, HTMLDreamyProps } from "./factory";

const DreamVisuallyHidden = dreamy.span;

export interface VisuallyHiddenProps extends HTMLDreamyProps<"span"> {}

/**
 * VisuallyHidden component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
	(props, ref) => {
		const [patternProps, restProps] = splitProps(props, []);

		const styleProps = visuallyHidden.raw(patternProps);

		return <dreamy.span ref={ref} {...styleProps} {...restProps} />;
	}
);

export interface VisuallyHiddenInputProps extends HTMLDreamyProps<"input"> {}

/**
 * VisuallyHiddenInput component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/visually-hidden
 */
export const VisuallyHiddenInput = forwardRef<
	HTMLInputElement,
	VisuallyHiddenInputProps
>((props, ref) => {
	const [patternProps, restProps] = splitProps(props, []);

	const styleProps = visuallyHidden.raw(patternProps);

	return <dreamy.input ref={ref} readOnly {...styleProps} {...restProps} />;
});
