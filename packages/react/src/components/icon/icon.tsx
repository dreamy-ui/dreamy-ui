import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type IconVariantProps, icon } from "styled-system/recipes";
import { dreamy } from "../factory";

export interface IconProps extends HTMLDreamProps<"svg">, IconVariantProps {}

const StyledIcon = dreamy("svg", icon);

/**
 * Icon component
 *
 * @See Docs https://dreamy-ui.com/docs/components/icon
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(({ ...props }, ref) => {
    return (
        <StyledIcon
            ref={ref}
            {...props}
        />
    );
});
