import { usePopoverContext } from "@/components/popover/popover-context";
import {
    PopoverTransition,
    type PopoverTransitionProps
} from "@/components/popover/popover-transition";
import { callAll } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import type { HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

export interface PopoverContentProps extends PopoverTransitionProps {
    rootProps?: HTMLDreamProps<"div">;
    motionProps?: Omit<HTMLMotionProps<"section">, "children">;
}

export const PopoverContentBase = forwardRef<HTMLElement, PopoverContentProps>(
    function PopoverContent(props, ref) {
        const { rootProps, motionProps, ...contentProps } = props;

        const { getPopoverProps, getPopoverPositionerProps, onAnimationComplete } =
            usePopoverContext();

        if (typeof document === "undefined") return null;

        return (
            <div {...getPopoverPositionerProps(rootProps)}>
                <PopoverTransition
                    {...(motionProps as any)}
                    {...getPopoverProps(contentProps, ref)}
                    onAnimationComplete={callAll(
                        onAnimationComplete,
                        contentProps.onAnimationComplete
                    )}
                />
            </div>
        );
    }
);

PopoverContentBase.displayName = "PopoverContent";
