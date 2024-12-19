import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { dreamy } from "../factory";

export interface AccordionIconProps extends HTMLDreamProps<"svg"> {}

const StyledIcon = dreamy.svg;

export const AccordionIconBase = forwardRef<SVGSVGElement, AccordionIconProps>(
    function AccordionIcon(props, ref) {
        return (
            <StyledIcon
                ref={ref}
                asChild
                {...props}
            >
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </StyledIcon>
        );
    }
);

AccordionIconBase.displayName = "AccordionIcon";
