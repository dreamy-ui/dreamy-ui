import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type IconVariantProps, icon } from "styled-system/recipes";

export interface IconProps extends HTMLDreamyProps<"svg">, IconVariantProps {}

const StyledIcon = dreamy("svg", icon);

/**
 * Icon component — styled SVG icon wrapper.
 *
 * @see Docs https://dreamy-ui.com/docs/components/icon
 *
 * @example
 * ```tsx
 * <Icon asChild>
 *   <svg viewBox="0 0 24 24" />
 * </Icon>
 * ```
 */
export function Icon({ ...props }: IconProps) {
    return <StyledIcon {...props} />;
}
