import { objectToDeps } from "@/utils/object";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef, useMemo } from "react";
import type { AccordionVariantProps } from "styled-system/recipes";
import { Box } from "../rsc";
import { AccordionDescendantsProvider, AccordionProvider } from "./accordion-context";
import { type UseAccordionProps, useAccordion } from "./use-accordion";

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

        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        const ctx = useMemo(
            () => ({ ...context, reduceMotion: !!ownProps.reduceMotion }),
            [...objectToDeps(context), ownProps.reduceMotion]
        );

        return (
            <AccordionDescendantsProvider value={descendants}>
                <AccordionProvider value={ctx}>
                    <Box
                        ref={ref}
                        {...htmlProps}
                    />
                </AccordionProvider>
            </AccordionDescendantsProvider>
        );
    }
);
