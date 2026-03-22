"use client";

import { type UsePopoverProps, usePopover } from "../popover/use-popover";

export interface UseHoverCardProps extends Omit<UsePopoverProps, "trigger"> {
    /**
     * Delay in ms before the hover card opens.
     * @default 300
     */
    openDelay?: number;
    /**
     * Delay in ms before the hover card closes.
     * @default 300
     */
    closeDelay?: number;
    size?: "sm" | "md" | "lg";
}

export function useHoverCard(props: UseHoverCardProps = {}) {
    const {
        openDelay = 300,
        closeDelay = 300,
        autoFocus = false,
        returnFocusOnClose = false,
        closeOnBlur = false,
        size,
        ...rest
    } = props;

    const popover = usePopover({
        ...rest,
        trigger: "hover",
        openDelay,
        closeDelay,
        autoFocus,
        returnFocusOnClose,
        closeOnBlur
    });

    return {
        ...popover,
        size
    };
}

export type UseHoverCardReturn = ReturnType<typeof useHoverCard>;
