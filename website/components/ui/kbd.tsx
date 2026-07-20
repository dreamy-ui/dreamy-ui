import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type KbdVariantProps, kbd } from "styled-system/recipes";

export interface KbdProps extends HTMLDreamyProps<"div">, KbdVariantProps {}

const StyledKbd = dreamy("div", kbd);

/**
 * Kbd component — keyboard key indicator.
 *
 * @see Docs https://dreamy-ui.com/docs/components/kbd
 *
 * @example
 * ```tsx
 * <Kbd>Ctrl</Kbd>
 * ```
 */
export function Kbd(props: KbdProps) {
    return <StyledKbd {...props} />;
}
