import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { type KbdVariantProps, kbd } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface KbdProps extends HTMLDreamProps<"div">, KbdVariantProps {}

const DreamKbd = dreamy("div", kbd);

/**
 * Kbd component
 *
 * @See Docs https://dream-ui.com/docs/components/kbd
 */
export const Kbd = forwardRef<HTMLDivElement, KbdProps>((props, ref) => {
    return (
        <DreamKbd
            ref={ref}
            {...props}
        />
    );
});
