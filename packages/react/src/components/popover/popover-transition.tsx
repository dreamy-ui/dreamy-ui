import { MotionBox } from "@/components/box";
import { PopoverArrow, type PopoverArrowProps } from "@/components/popover/popover-arrow";
import { useMotionVariants } from "@/provider";
import type { HTMLDreamProps } from "@/utils/types";
import type { HTMLMotionProps } from "framer-motion";
import type React from "react";
import { forwardRef } from "react";
import { usePopoverContext } from "./popover-context";

type HTMLMotionDreamProps<T extends keyof React.ReactHTML> = Omit<
    HTMLDreamProps<T>,
    keyof HTMLMotionProps<T>
> & {
    children?: React.ReactNode;
} & Omit<
        HTMLMotionProps<T>,
        | "style"
        | "onDrag"
        | "onDragEnd"
        | "onDragStart"
        | "onAnimationStart"
        | "variants"
        | "transition"
        | "children"
    >;

export interface PopoverTransitionProps extends HTMLMotionDreamProps<"section"> {
    /**
     * Props to be forwarded to the arrow component
     */
    arrowProps?: PopoverArrowProps;
}

export const PopoverTransition = forwardRef(function PopoverTransition(
    props: PopoverTransitionProps,
    ref: React.Ref<any>
) {
    const { children, arrowProps, ...rest } = props;

    const { isOpen, hasArrow } = usePopoverContext();
    const { popover } = useMotionVariants();

    return (
        <MotionBox
            ref={ref}
            variants={popover.default}
            initial={false}
            animate={isOpen ? "initial" : "exit"}
            {...rest}
        >
            {hasArrow && <PopoverArrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
});

PopoverTransition.displayName = "PopoverTransition";
