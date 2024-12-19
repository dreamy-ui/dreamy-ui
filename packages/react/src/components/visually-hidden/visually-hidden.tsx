import { dreamy } from "@/components/factory";
import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { visuallyHidden } from "@dreamy-ui/system/patterns";
import { forwardRef } from "react";

const DreamVisuallyHidden = dreamy.span;

/**
 * VisuallyHidden component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLDreamProps<"span">>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, []);

    const styleProps = visuallyHidden.raw(patternProps);

    return (
        <DreamVisuallyHidden
            ref={ref}
            {...styleProps}
            {...restProps}
        />
    );
});

const DreamVisuallyHiddenInput = dreamy.input;

/**
 * VisuallyHiddenInput component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHiddenInput = forwardRef<HTMLInputElement, HTMLDreamProps<"input">>(
    (props, ref) => {
        const [patternProps, restProps] = splitProps(props, []);

        const styleProps = visuallyHidden.raw(patternProps);

        return (
            <DreamVisuallyHiddenInput
                ref={ref}
                readOnly
                {...styleProps}
                {...restProps}
            />
        );
    }
);
