import { Popover } from "@/components/popover";
import { HiddenSelect } from "@/components/select/select-hidden";
import {
    SelectDescendantsProvider,
    type UseSelectProps,
    useSelect
} from "@/components/select/use-select";
import { Box } from "@/rsc";
import type { HTMLDreamProps } from "@/utils/types";
import type { ReactNode } from "react";
import { splitCssProps } from "styled-system/jsx";
import { SelectProvider } from "./select-context";

export interface SelectProps<T extends boolean>
    extends UseSelectProps<T>,
        Omit<HTMLDreamProps<"div">, keyof UseSelectProps<T>> {
    children?: ReactNode;
}

export function SelectRoot<T extends boolean = false>({ children, ...props }: SelectProps<T>) {
    const [cssProps, restProps] = splitCssProps(props);
    const ctx = useSelect<T>(restProps);

    return (
        <SelectProvider value={ctx as any}>
            <Box
                {...ctx.getRootProps({
                    ...cssProps,
                    className: restProps.className
                })}
            >
                <HiddenSelect {...(ctx.getHiddenSelectProps() as any)} />
                <Popover
                    placement="bottom"
                    isOpen={ctx.isOpen}
                    onOpen={ctx.onOpen}
                    onClose={ctx.onClose}
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    lazyBehavior="keepMounted"
                    reduceMotion={ctx.reduceMotion}
                    {...props.popoverProps}
                >
                    <SelectDescendantsProvider value={ctx.descendants}>
                        {children}
                    </SelectDescendantsProvider>
                </Popover>
            </Box>
        </SelectProvider>
    );
}
