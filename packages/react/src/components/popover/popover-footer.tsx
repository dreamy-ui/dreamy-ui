import { Box, type BoxProps } from "@/components/box";
import { forwardRef } from "react";

export interface PopoverFooterProps extends BoxProps {}

export const PopoverFooterBase = forwardRef<HTMLDivElement, PopoverFooterProps>(
    function PopoverFooter(props, ref) {
        return <Box as={"footer"} {...props} ref={ref} />;
    }
);

PopoverFooterBase.displayName = "PopoverFooter";
