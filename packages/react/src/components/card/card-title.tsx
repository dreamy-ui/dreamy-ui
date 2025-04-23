import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardTitleProps extends HTMLDreamProps<"h3"> {}

const StyledCardTitle = dreamy.h3;

export const CardTitleBase = forwardRef<HTMLHeadingElement, CardTitleProps>((props, ref) => {
    return (
        <StyledCardTitle
            ref={ref}
            {...props}
        />
    );
});
