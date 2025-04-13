import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardHeaderProps extends HTMLDreamProps<"div"> {}

const StyledCardHeader = dreamy.div;

export const CardHeaderBase = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
    return (
        <StyledCardHeader
            ref={ref}
            {...props}
        />
    );
});
