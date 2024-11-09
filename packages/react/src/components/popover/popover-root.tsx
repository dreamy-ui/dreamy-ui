import { PopoverProvider } from "@/components/popover/popover-context";
import { type UsePopoverProps, usePopover } from "@/components/popover/use-popover";
import type { MaybeRenderProp } from "@/utils";
import { runIfFn } from "@/utils/run-if-fn";

export interface PopoverProps extends UsePopoverProps {
    /**
     * The content of the popover. It is usually the `PopoverTrigger`,
     * and `PopoverContent`
     */
    children?: MaybeRenderProp<{
        isOpen: boolean;
        onClose: () => void;
        forceUpdate: (() => void) | undefined;
    }>;
    /**
     * If `true`, the popover will have an arrow pointing to the trigger
     * @default true
     */
    hasArrow?: boolean;
}

export function PopoverRoot(props: PopoverProps) {
    const { children, direction, hasArrow, ...rest } = props;

    const context = usePopover({ ...rest, direction: direction ?? "ltr" });

    return (
        <PopoverProvider
            value={{
                ...context,
                hasArrow: hasArrow ?? false
            }}
        >
            {runIfFn(children, {
                isOpen: context.isOpen,
                onClose: context.onClose,
                forceUpdate: context.forceUpdate
            })}
        </PopoverProvider>
    );
}

PopoverRoot.displayName = "Popover";
