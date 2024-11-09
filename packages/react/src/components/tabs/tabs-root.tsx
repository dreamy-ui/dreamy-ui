import { Box } from "@/components/box";
import {
    TabsDescendantsProvider,
    TabsProvider,
    type UseTabsProps,
    useTabs
} from "@/components/tabs/use-tabs";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface TabsProps
    extends UseTabsProps,
        Omit<HTMLDreamProps<"div">, "onChange" | "direction"> {
    children: React.ReactNode;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
    const { children, ...rest } = props;

    const { htmlProps, descendants, ...ctx } = useTabs(rest);

    return (
        <TabsDescendantsProvider value={descendants}>
            <TabsProvider value={ctx}>
                <Box
                    ref={ref}
                    {...htmlProps}
                >
                    {children}
                </Box>
            </TabsProvider>
        </TabsDescendantsProvider>
    );
});

TabsRoot.displayName = "Tabs";
