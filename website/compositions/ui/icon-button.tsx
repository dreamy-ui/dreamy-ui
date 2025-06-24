"use client";

import { forwardRef } from "react";
import type { ButtonVariantProps } from "styled-system/recipes";
import { Button, type UniversalButtonProps } from "./button";
import type { HTMLDreamyProps } from "./factory";

interface Props extends UniversalButtonProps {
    /**
     * aria-label is required for accessibility
     */
    "aria-label": string;
    /*
     * The icon to display
     */
    icon: React.ReactNode;
}

export interface IconButtonProps
    extends Omit<HTMLDreamyProps<"button">, "aria-label" | "children">,
        ButtonVariantProps,
        Props {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                {...props}
                data-type={"icon-button"}
            >
                {icon}
            </Button>
        );
    }
);
