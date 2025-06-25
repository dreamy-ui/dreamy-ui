"use client";

import { forwardRef } from "react";
import type { ButtonVariantProps } from "styled-system/recipes";
import type { UniversalButtonProps } from "./button";
import type { HTMLDreamyProps } from "./factory";
import { IconButton } from "./icon-button";

interface Props extends UniversalButtonProps {}

export interface CloseButtonProps
    extends Omit<HTMLDreamyProps<"button">, "aria-label" | "children">,
        ButtonVariantProps,
        Props {}

/**
 * CloseButton component
 *
 * @See Docs https://dreamy-ui.com/docs/components/close-button
 */
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
                        style={{
                            width: "var(--icon-button-icon-size)",
                            height: "var(--icon-button-icon-size)"
                        }}
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
