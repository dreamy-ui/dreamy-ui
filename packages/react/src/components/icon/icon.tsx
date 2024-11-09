import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type IconVariantProps, icon } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface IconProps extends HTMLDreamProps<"svg">, IconVariantProps {}

const StyledIcon = styled(dream.svg, icon);

/**
 * Icon component
 *
 * @See Docs https://dream-ui.com/docs/components/icon
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(({ ...props }, ref) => {
    return (
        <StyledIcon
            ref={ref}
            {...props}
        />
    );
});
