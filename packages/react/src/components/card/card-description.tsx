import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";

export interface CardDescriptionProps extends HTMLDreamProps<"p"> {}

const StyledCardDescription = dreamy.p;

export const CardDescriptionBase = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    (props, ref) => {
        return (
            <StyledCardDescription
                ref={ref}
                {...props}
            />
        );
    }
);
