import type { HTMLDreamProps } from "@/utils/types";
import { Box } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";
import { Collapse, type CollapseProps } from "../transitions";
import { useAccordionContext, useAccordionItemContext } from "./accordion-context";

export interface AccordionContentProps extends HTMLDreamProps<"div"> {
    /**
     * The properties passed to the underlying `Collapse` component.
     */
    collapseProps?: CollapseProps;
}

export const AccordionContentBase = forwardRef<HTMLDivElement, AccordionContentProps>(
    function AccordionContent(props, ref) {
        const { collapseProps, ...rest } = props;

        const { reduceMotion } = useAccordionContext();
        const { getContentProps, isOpen } = useAccordionItemContext();

        // remove `hidden` prop, 'coz we're using height animation
        const panelProps = getContentProps(rest, ref) as any;

        if (!reduceMotion) {
            // biome-ignore lint/performance/noDelete: <explanation>
            delete panelProps.hidden;
        }

        const child = <Box {...panelProps} />;

        if (!reduceMotion) {
            return (
                <Collapse
                    in={isOpen}
                    {...collapseProps}
                >
                    {child}
                </Collapse>
            );
        }

        return child;
    }
);

AccordionContentBase.displayName = "AccordionItem";
