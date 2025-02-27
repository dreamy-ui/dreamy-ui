import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type DividerProperties, divider } from "styled-system/patterns";

export interface DividerProps
    extends Omit<HTMLDreamProps<"hr">, keyof DividerProperties>,
        DividerProperties {}

const DreamDivider = dreamy.hr;

/**
 * Divider component
 *
 * @See Docs https://dreamy-ui.com/docs/components/divider
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
