import { HTMLDreamProps } from "@/utils/types";
import { Box } from "@dreamy-ui/system/jsx";
import { forwardRef, useMemo } from "react";
import { AccordionItemProvider } from "./accordion-context";
import { useAccordionItem, UseAccordionItemProps } from "./use-accordion";

export interface AccordionItemProps
	extends Omit<
			HTMLDreamProps<"div">,
			keyof UseAccordionItemProps | "children"
		>,
		UseAccordionItemProps {
	children?:
		| React.ReactNode
		| ((props: {
				isExpanded: boolean;
				isDisabled: boolean;
		  }) => React.ReactNode);
}

export const AccordionItemBase = forwardRef<HTMLDivElement, AccordionItemProps>(
	function AccordionItem(props, ref) {
		const { children } = props;
		const { htmlProps, ...context } = useAccordionItem(props);

		const ctx = useMemo(() => context, [context]);

		return (
			<AccordionItemProvider value={ctx}>
				<Box ref={ref} {...htmlProps}>
					{typeof children === "function"
						? children({
								isExpanded: !!context.isOpen,
								isDisabled: !!context.isDisabled
							})
						: children}
				</Box>
			</AccordionItemProvider>
		);
	}
);

AccordionItemBase.displayName = "AccordionItem";
