"use client";

import type { HTMLDreamyProps } from "styled-system/jsx";
import type { ButtonVariantProps } from "styled-system/recipes";
import { Button, type UniversalButtonProps } from "../button";

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
        Props {}

/**
 * IconButton component
 *
 * @See Docs https://dreamy-ui.com/docs/components/icon-button
 */
export function IconButton({ icon, children, ...props }: IconButtonProps) {
    return (
        <Button
            {...props}
            data-type={"icon-button"}
        >
            {icon ?? children}
        </Button>
    );
}
