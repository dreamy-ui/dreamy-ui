import type { HTMLDreamProps } from "@/utils/types";
import { Box } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";
import { AccordionItemProvider } from "./accordion-context";
import { type UseAccordionItemProps, useAccordionItem } from "./use-accordion";

export interface AccordionItemProps
    extends Omit<HTMLDreamProps<"div">, keyof UseAccordionItemProps | "children">,
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
        const { htmlProps, ...ctx } = useAccordionItem(props);

        return (
            <AccordionItemProvider value={ctx}>
                <Box
                    ref={ref}
                    {...htmlProps}
                >
                    {typeof children === "function"
                        ? children({
                              isExpanded: !!ctx.isOpen,
                              isDisabled: !!ctx.isDisabled
                          })
                        : children}
                </Box>
            </AccordionItemProvider>
        );
    }
);

AccordionItemBase.displayName = "AccordionItem";
