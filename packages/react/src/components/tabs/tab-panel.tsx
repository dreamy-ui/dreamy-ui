import { Flex } from "@/components/flex/flex";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { useTabPanel } from "./use-tabs";

export interface TabPanelProps extends HTMLDreamProps<"div"> {}

/**
 * TabPanel
 *
 * Used to render the content for a specific tab.
 */
export const TabPanelBase = forwardRef<HTMLDivElement, TabPanelProps>(
	function TabPanel(props, ref) {
		const panelProps = useTabPanel({ ...props, ref });

		return <Flex {...panelProps} ref={ref} />;
	}
);

TabPanelBase.displayName = "TabPanel";
