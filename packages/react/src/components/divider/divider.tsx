import { dream } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type DividerProperties, divider } from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

export interface DividerProps
    extends Omit<HTMLDreamProps<"hr">, keyof DividerProperties>,
        DividerProperties {}

const DreamDivider = styled(dream.hr);

/**
 * Divider component
 *
 * @See Docs https://dream-ui.com/docs/components/divider
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, ["orientation", "thickness", "color"]);

    const styleProps = divider.raw(patternProps);

    return (
        <DreamDivider
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});
