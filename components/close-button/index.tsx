"use client";

import { IconButton, type IconButtonProps } from "../icon-button";
export interface CloseButtonProps extends Omit<IconButtonProps, "aria-label" | "icon"> {
    /**
     * aria-label optional for accessibility
     */
    "aria-label"?: string;
    /*
     * The override icon to display
     */
    icon?: React.ReactNode;
}

/**
 * CloseButton component
 *
 * @See Docs https://dreamy-ui.com/docs/components/close-button
 */
export function CloseButton({
    "aria-label": ariaLabel = "Close",
    icon,
    ...props
}: CloseButtonProps) {
    return (
        <IconButton
            aria-label={ariaLabel}
            size={"sm"}
            variant={"ghost"}
            {...props}
            icon={
                icon ?? (
                    <svg
                        aria-hidden="true"
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
                )
            }
        />
    );
}
