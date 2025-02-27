"use client";

import { createStyleContext } from "@/components/style-context";
import { accordion } from "styled-system/recipes";
import { AccordionContentBase } from "./accordion-content";
import { AccordionIconBase } from "./accordion-icon";
import { AccordionItemBase } from "./accordion-item";
import { AccordionRoot } from "./accordion-root";
import { AccordionTriggerBase } from "./accordion-trigger";

const { withProvider, withContext } = createStyleContext(accordion);

/**
 * Accordion component
 *
 * @See Docs https://dreamy-ui.com/docs/components/accordion
 */
export const Accordion = withProvider(AccordionRoot, "root");
export const AccordionItem = withContext(AccordionItemBase, "item");
export const AccordionContent = withContext(AccordionContentBase, "content");
export const AccordionTrigger = withContext(AccordionTriggerBase, "trigger");
/**
 * @internal
 */
export const AccordionIcon = withContext(AccordionIconBase, "icon");
