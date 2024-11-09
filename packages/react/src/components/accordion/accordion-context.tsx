import { createContext } from "@/provider/create-context";
import { createDescendantContext } from "../descendant";
import type { UseAccordionItemReturn, UseAccordionReturn } from "./use-accordion";

interface AccordionContext extends Omit<UseAccordionReturn, "htmlProps" | "descendants"> {
    reduceMotion: boolean;
}

export const [AccordionProvider, useAccordionContext] = createContext<AccordionContext>({
    name: "AccordionContext",
    hookName: "useAccordionContext",
    providerName: "Accordion"
});

type AccordionItemContext = Omit<UseAccordionItemReturn, "htmlProps">;

export const [AccordionItemProvider, useAccordionItemContext] = createContext<AccordionItemContext>(
    {
        name: "AccordionItemContext",
        hookName: "useAccordionItemContext",
        providerName: "<AccordionItem />"
    }
);

/* -------------------------------------------------------------------------------------------------
 * Create context to track descendants and their indices
 * -----------------------------------------------------------------------------------------------*/

export const [
    AccordionDescendantsProvider,
    useAccordionDescendantsContext,
    useAccordionDescendants,
    useAccordionDescendant
] = createDescendantContext<HTMLButtonElement>();
