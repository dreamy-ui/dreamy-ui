import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type IconVariantProps, icon } from "styled-system/recipes";

export interface IconProps extends HTMLDreamyProps<"svg">, IconVariantProps {}

const StyledIcon = dreamy("svg", icon);

/**
 * Icon component
 *
 * @See Docs https://dreamy-ui.com/docs/components/icon
 */
export function Icon({ ...props }: IconProps) {
    return <StyledIcon {...props} />;
}
