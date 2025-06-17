import { forwardRef } from "react";
import { kbd, KbdVariantProps } from "styled-system/recipes";
import { dreamy, HTMLDreamyProps } from "./factory";

export interface KbdProps extends HTMLDreamyProps<"div">, KbdVariantProps {}

const DreamKbd = dreamy("div", kbd);

/**
 * Kbd component
 *
 * @See Docs https://dreamy-ui.com/docs/components/kbd
 */
export const Kbd = forwardRef<HTMLDivElement, KbdProps>((props, ref) => {
	return <DreamKbd ref={ref} {...props} />;
});
