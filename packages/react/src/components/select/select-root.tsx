import { Popover } from "@/components/popover";
import { HiddenSelect } from "@/components/select/select-hidden";
import {
    SelectDescendantsProvider,
    type UseSelectProps,
    useSelect
} from "@/components/select/use-select";
import { Box } from "@/rsc";
import { forwardRef } from "react";
import { SelectProvider } from "./select-context";

export interface SelectProps extends UseSelectProps {}

export const SelectRoot = forwardRef<HTMLDivElement, SelectProps>(function SelectRoot(
    { children, className, ...props },
    ref
) {
    const { rest, ...ctx } = useSelect(props);

    return (
        <SelectProvider value={ctx}>
            <Box {...ctx.getRootProps({ className }, ref)}>
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
});
