import { Flex, type FlexProps } from "@/components/flex";
import { type UseTabListProps, useTabList } from "@/components/tabs/use-tabs";
import { forwardRef } from "react";

export interface TabListProps extends UseTabListProps, Omit<FlexProps, "onKeyDown" | "ref"> {}

/**
 * TabList is used to manage a list of tab buttons. It renders a `div` by default,
 * and is responsible the keyboard interaction between tabs.
 */
export const TabListBase = forwardRef<HTMLDivElement, TabListProps>(function TabList(props, ref) {
    const tablistProps = useTabList({ ...props, ref });

    return <Flex {...tablistProps} />;
});

TabListBase.displayName = "TabList";
