import { Popover } from "@/components/popover";
import { HiddenSelect } from "@/components/select/select-hidden";
import {
    SelectDescendantsProvider,
    type UseSelectProps,
    useSelect
} from "@/components/select/use-select";
import { Box } from "@/rsc";
import type { ReactNode } from "react";
import { SelectProvider } from "./select-context";

export interface SelectProps<T extends boolean> extends UseSelectProps<T> {
    children?: ReactNode;
    className?: string;
}

export function SelectRoot<T extends boolean = false>({
    children,
    className,
    ...props
}: SelectProps<T>) {
    const { rest, ...ctx } = useSelect<T>(props);

    return (
        <SelectProvider value={ctx as any}>
            <Box {...ctx.getRootProps({ className })}>
                <HiddenSelect {...(ctx.getHiddenSelectProps() as any)} />
                <Popover
                    placement="bottom"
                    isOpen={ctx.isOpen}
                    onOpen={ctx.onOpen}
                    onClose={ctx.onClose}
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    {...props.popoverProps}
                    lazyBehavior="keepMounted"
                    reduceMotion={ctx.reduceMotion}
                >
                    <SelectDescendantsProvider value={ctx.descendants}>
                        {children}
                    </SelectDescendantsProvider>
                </Popover>
            </Box>
        </SelectProvider>
    );
}
