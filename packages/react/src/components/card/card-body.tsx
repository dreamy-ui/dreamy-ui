import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardBodyProps extends HTMLDreamProps<"div"> {}

const StyledCardBody = dreamy.div;

export const CardBodyBase = forwardRef<HTMLDivElement, CardBodyProps>((props, ref) => {
    return (
        <StyledCardBody
            ref={ref}
            {...props}
        />
    );
});
