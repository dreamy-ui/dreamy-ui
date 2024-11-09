import { Button, type ButtonProps } from "@/components/button";
import { TabIndicator } from "@/components/tabs/tabs";
import { type UseTabOptions, useTab } from "@/components/tabs/use-tabs";
import { forwardRef } from "react";

export interface TabProps extends UseTabOptions, ButtonProps {}

/**
 * Tab button used to activate a specific tab panel. It renders a `button`,
 * and is responsible for automatic and manual selection modes.
 */
export const TabBase = forwardRef<HTMLButtonElement, TabProps>(function Tab(props, ref) {
    const { children, ...rest } = props;

    const { isSelected, props: tabProps } = useTab({ ...rest, ref });

    return (
        <Button
            size={"sm"}
            variant={"ghost"}
            {...tabProps}
        >
            {children}
            {isSelected && <TabIndicator />}
        </Button>
    );
});

TabBase.displayName = "Tab";
