"use client";

import type { ButtonVariantProps } from "styled-system/recipes";
import { Button, type ButtonProps } from "./button";

interface Props {
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
    extends Omit<ButtonProps, keyof Props>,
        ButtonVariantProps,
        Props {}

/**
 * IconButton component — button that displays an icon.
 *
 * @see Docs https://dreamy-ui.com/docs/components/icon-button
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Settings" icon={<Icon>...</Icon>} />
 * ```
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
