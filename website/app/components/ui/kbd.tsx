import { forwardRef } from "react";
import { type KbdVariantProps, kbd } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface KbdProps extends HTMLDreamyProps<"div">, KbdVariantProps {}

const DreamKbd = dreamy("div", kbd);

/**
 * Kbd component
 *
 * @See Docs https://dreamy-ui.com/docs/components/kbd
 */
export const Kbd = forwardRef<HTMLDivElement, KbdProps>((props, ref) => {
    return (
        <DreamKbd
            ref={ref}
            {...props}
        />
    );
});
