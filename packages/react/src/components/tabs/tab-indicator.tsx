import type { MotionBoxProps } from "@/components/box";
import { MotionFlex } from "@/components/flex";
import { useTabsContext } from "@/components/tabs/use-tabs";
import { useCanUseDOM, useDefaultTransition } from "@/provider";
import { forwardRef } from "react";

export interface TabIndicatorProps extends MotionBoxProps {}

/**
 * Tab Indicator that animates when the tab is selected.
 */
export const TabIndicatorBase = forwardRef<HTMLDivElement, TabIndicatorProps>(
    function TabIndicator(props, ref) {
        const { id } = useTabsContext();
        const transition = useDefaultTransition();
        const domAvailable = useCanUseDOM();

        return (
            <MotionFlex
                ref={ref}
                {...props}
                // as={"span"}
                layout
                layoutId={`${id}-indicator`}
                layoutDependency={false}
                transition={{
                    ...transition,
                    // @ts-ignore - again stupid
                    duration: (transition?.duration ?? 0.2) * 1.5
                }}
                // animating indicator enter on hydration
                initial={!domAvailable ? { opacity: 0, scale: 0.95 } : undefined}
                animate={{ opacity: 1, scale: 1 }}
                rounded={"inherit"}
            />
        );
    }
);

TabIndicatorBase.displayName = "TabIndicator";
