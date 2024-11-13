import { Flex, type FlexProps } from "@/components/flex";
import { forwardRef } from "react";
import { useTabPanels } from "./use-tabs";

export interface TabPanelsProps extends FlexProps {}

/**
 * TabPanel
 *
 * Used to manage the rendering of multiple tab panels. It uses
 * `cloneElement` to hide/show tab panels.
 *
 * It renders a `div` by default.
 */
export const TabPanelsBase = forwardRef<HTMLDivElement, TabPanelsProps>(
    function TabPanels(props, ref) {
        const panelsProps = useTabPanels(props);

        return (
            <Flex
                {...panelsProps}
                ref={ref}
            />
        );
    }
);

TabPanelsBase.displayName = "TabPanels";
