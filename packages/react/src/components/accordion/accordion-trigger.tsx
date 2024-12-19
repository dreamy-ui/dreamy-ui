import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import type { IconProps } from "../icon";
import { AccordionIcon } from "./accordion";
import { useAccordionItemContext } from "./accordion-context";

export interface AccordionTriggerProps extends HTMLDreamProps<"button"> {
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

const StyledTrigger = dreamy.button;

/**
 * AccordionButton is used expands and collapses an accordion item.
 * It must be a child of `AccordionItem`.
 */
export const AccordionTriggerBase = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    function AccordionTrigger(
        { headingTag: HeadingTag = "h2", children, icon, iconProps, ...props },
        ref
    ) {
        const { getTriggerProps } = useAccordionItemContext();

        return (
            <HeadingTag>
                <StyledTrigger {...(getTriggerProps(props, ref) as any)}>
                    {children}
                    {icon ?? <AccordionIcon {...iconProps} />}
                </StyledTrigger>
            </HeadingTag>
        );
    }
);

AccordionTriggerBase.displayName = "AccordionTrigger";
