import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type KbdVariantProps, kbd } from "styled-system/recipes";

export interface KbdProps extends HTMLDreamProps<"div">, KbdVariantProps {}

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
