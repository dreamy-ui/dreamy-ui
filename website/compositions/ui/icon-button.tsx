"use client";

import { forwardRef } from "react";
import type { HTMLDreamyProps } from "styled-system/jsx";
import type { ButtonVariantProps } from "styled-system/recipes";
import { Button, type UniversalButtonProps } from "./button";

interface Props extends UniversalButtonProps {
    /**
     * aria-label is required for accessibility
     */
    "aria-label": string;
    /*
     * The icon to display
     */
    icon?: React.ReactNode;
}

export interface IconButtonProps
    extends Omit<HTMLDreamyProps<"button">, keyof Props>,
    ButtonVariantProps,
    Props { }

/**
 * IconButton component
 *
 * @See Docs https://dreamy-ui.com/docs/components/icon-button
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                {...props}
                data-type={"icon-button"}
            >
                {icon ?? children}
            </Button>
        );
    }
);
