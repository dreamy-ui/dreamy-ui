"use client";

import {
    Accordion as ArkAccordion,
    type AccordionItemContentProps as ArkAccordionItemContentProps,
    type AccordionItemProps as ArkAccordionItemProps,
    type AccordionRootProps as ArkAccordionRootProps,
    useAccordionItemContext
} from "@ark-ui/react/accordion";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { AccordionVariantProps } from "styled-system/recipes";
import { accordion } from "styled-system/recipes";
import type { IconProps } from "../icon";
import { Collapse, type CollapseProps } from "../transitions";

const { withProvider, withContext } = createStyleContext(accordion);

export interface AccordionProps
    extends ArkAccordionRootProps,
        Omit<HTMLDreamyProps<"div">, keyof ArkAccordionRootProps>,
        AccordionVariantProps {}

/**
 * Accordion component — expandable sections for progressive disclosure.
 *
 * @see Docs https://dreamy-ui.com/docs/components/accordion
 *
 * @example
 * ```tsx
 * <Accordion.Root>
 *   <Accordion.Item value="section">
 *     <Accordion.Trigger>Section</Accordion.Trigger>
 *     <Accordion.Content>Details</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const Root = withProvider(ArkAccordion.Root, "root");

export interface AccordionItemProps
    extends ArkAccordionItemProps,
        Omit<HTMLDreamyProps<"div">, keyof ArkAccordionItemProps> {}

/**
 * Accordion Item — a single expandable section within the accordion.
 */
export const Item = withContext(ArkAccordion.Item, "item");

const ItemTrigger = withContext(ArkAccordion.ItemTrigger, "trigger");
const Body = withContext(dreamy.div, "body");
const ItemIndicator = withContext(ArkAccordion.ItemIndicator, "icon");

export interface AccordionContentProps
    extends ArkAccordionItemContentProps,
        Omit<HTMLDreamyProps<"div">, keyof ArkAccordionItemContentProps> {
    /**
     * Props passed to the underlying `Collapse` component when motion is enabled.
     */
    collapseProps?: CollapseProps;
}

/**
 * Accordion Content — the collapsible panel revealed when an item is expanded.
 */
export const Content = withContext(function AccordionContent(props: AccordionContentProps) {
    const { children, collapseProps, ...rest } = props;
    const { expanded } = useAccordionItemContext();

    return (
        <ArkAccordion.ItemContent
            {...rest}
            hidden={false}
        >
            <Collapse
                isOpen={expanded}
                {...collapseProps}
            >
                <Body>{children}</Body>
            </Collapse>
        </ArkAccordion.ItemContent>
    );
}, "content");

export interface AccordionTriggerProps extends HTMLDreamyProps<"button"> {
    /**
     * The heading tag to use for the wrapper of the trigger.
     * @default "h2"
     */
    headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /**
     * Removes default icon and allows for custom icon to be passed in.
     */
    icon?: React.ReactNode;
    /**
     * Props to pass to the default icon.
     */
    iconProps?: IconProps;
}

/**
 * Accordion Trigger — the button that expands or collapses an item.
 */
export function Trigger({
    headingTag: HeadingTag = "h2",
    children,
    icon,
    iconProps,
    ...props
}: AccordionTriggerProps) {
    return (
        <HeadingTag>
            <ItemTrigger {...props}>
                {children}
                {icon ?? (
                    <ItemIndicator>
                        <AccordionIcon {...iconProps} />
                    </ItemIndicator>
                )}
            </ItemTrigger>
        </HeadingTag>
    );
}

export interface AccordionIconProps extends HTMLDreamyProps<"svg"> {}

/**
 * Default chevron icon for the accordion trigger.
 *
 * @internal
 */
function AccordionIcon(props: AccordionIconProps) {
    return (
        <dreamy.svg
            aria-hidden="true"
            asChild
            {...props}
        >
            <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </dreamy.svg>
    );
}
