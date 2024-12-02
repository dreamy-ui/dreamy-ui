import { dream } from "@/components/factory";
import type { IconProps } from "@/rsc";
import { styled } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";

const StyledIcon = styled(dream.svg);

export const SelectIndicatorBase = forwardRef<SVGSVGElement, IconProps>(
    function SelectIndicator(props, ref) {
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
