import { HTMLDreamProps } from "@/utils/types";
import { Box } from "@dreamy-ui/system/jsx";
import { AccordionVariantProps } from "@dreamy-ui/system/recipes";
import { forwardRef, useMemo } from "react";
import {
	AccordionDescendantsProvider,
	AccordionProvider
} from "./accordion-context";
import { useAccordion, UseAccordionProps } from "./use-accordion";

export interface AccordionProps
	extends UseAccordionProps,
		Omit<HTMLDreamProps<"div">, keyof UseAccordionProps>,
		AccordionVariantProps {
	/**
	 * If `true`, height animation and transitions will be disabled.
	 *
	 * @default false
	 */
	reduceMotion?: boolean;
}

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
	function AccordionRoot(ownProps, ref) {
		const { htmlProps, descendants, ...context } = useAccordion(ownProps);

		const ctx = useMemo(
			() => ({ ...context, reduceMotion: !!ownProps.reduceMotion }),
			[context, ownProps.reduceMotion]
		);

		return (
			<AccordionDescendantsProvider value={descendants}>
				<AccordionProvider value={ctx}>
					<Box ref={ref} {...htmlProps} />
				</AccordionProvider>
			</AccordionDescendantsProvider>
		);
	}
);
