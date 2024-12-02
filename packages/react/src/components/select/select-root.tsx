import { Popover } from "@/components/popover";
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
                <Popover
                    placement="bottom"
                    isOpen={ctx.isOpen}
                    onOpen={ctx.onOpen}
                    onClose={ctx.onClose}
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    {...props.popoverProps}
                >
                    <SelectDescendantsProvider value={ctx.descendants}>
                        {children}
                    </SelectDescendantsProvider>
                </Popover>
            </Box>
        </SelectProvider>
    );
});
