import { dreamy } from "@/components/factory";
import { useSelectContext } from "@/components/select/select-context";
import type { IconProps } from "@/rsc";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

const StyledIcon = dreamy.svg;

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

const StyledButton = dreamy.button;

export interface SelectClearButtonProps extends HTMLDreamProps<"button"> {}

export const SelectClearButtonBase = forwardRef<HTMLButtonElement, SelectClearButtonProps>(
    function SelectClearButton(props, ref) {
        const { getClearButtonProps } = useSelectContext();

        return (
            <StyledButton {...getClearButtonProps(props, ref)}>
                <StyledIcon asChild>
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
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </StyledIcon>
            </StyledButton>
        );
    }
);
