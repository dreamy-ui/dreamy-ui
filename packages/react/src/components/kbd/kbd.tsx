import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type KbdVariantProps, kbd } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

export interface KbdProps extends HTMLDreamProps<"div">, KbdVariantProps {}

const DreamKbd = styled(dream.div, kbd);

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
