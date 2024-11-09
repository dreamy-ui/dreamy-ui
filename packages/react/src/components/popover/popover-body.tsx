import { Box } from "@/components/box";
import { usePopoverContext } from "@/components/popover/popover-context";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface PopoverBodyProps extends HTMLDreamProps<"div"> {}

export const PopoverBodyBase = forwardRef<HTMLDivElement, PopoverBodyProps>(
    function PopoverHeader(props, ref) {
        const { getBodyProps } = usePopoverContext();

        return <Box {...getBodyProps(props, ref)} />;
    }
);

PopoverBodyBase.displayName = "PopoverBody";
