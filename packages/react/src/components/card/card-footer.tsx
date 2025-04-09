import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardFooterProps extends HTMLDreamProps<"div"> {}

const StyledCardFooter = dreamy.div;

export const CardFooterBase = forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
    return (
        <StyledCardFooter
            ref={ref}
            {...props}
        />
    );
});
