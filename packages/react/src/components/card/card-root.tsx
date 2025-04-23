import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardRootProps extends HTMLDreamProps<"div"> {}

const StyledCard = dreamy.div;

export const CardRoot = forwardRef<HTMLDivElement, CardRootProps>((props, ref) => {
    return (
        <StyledCard
            ref={ref}
            {...props}
        />
    );
});
