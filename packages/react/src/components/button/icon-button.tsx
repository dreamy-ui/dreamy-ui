"use client";

import { Button, type UniversalButtonProps } from "@/components/button/button";
import type { HTMLDreamProps } from "@/utils/types";
import { css, cx } from "@dreamy-ui/system/css";
import type { ButtonVariantProps } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

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
    extends Omit<HTMLDreamProps<"button">, "aria-label" | "children">,
        ButtonVariantProps,
        Props {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ isLoading, isDisabled, icon, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                data-loading={isLoading}
                data-disabled={isDisabled}
                disabled={isDisabled || isLoading}
                {...props}
                className={cx(
                    css({
                        px: "0 !important",
                        py: "0 !important",
                        aspectRatio: 1
                    }),
                    props.className
                )}
            >
                {icon}
            </Button>
        );
    }
);
