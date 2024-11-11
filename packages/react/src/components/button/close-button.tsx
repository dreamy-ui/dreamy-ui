"use client";

import type { UniversalButtonProps } from "@/components/button/button";
import { IconButton } from "@/components/button/icon-button";
import type { HTMLDreamProps } from "@/utils/types";
import type { ButtonVariantProps } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

interface Props extends UniversalButtonProps {}

export interface CloseButtonProps
    extends Omit<HTMLDreamProps<"button">, "aria-label" | "children">,
        ButtonVariantProps,
        Props {}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
    ({ isLoading, isDisabled, ...props }, ref) => {
        return (
            <IconButton
                ref={ref}
                data-loading={isLoading}
                data-disabled={isDisabled}
                disabled={isDisabled || isLoading}
                aria-label="Close"
                size={"sm"}
                variant={"ghost"}
                icon={
                    <svg
                        role={"img"}
                        aria-label="Close"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="24"
                        height="24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                }
                {...props}
            />
        );
    }
);