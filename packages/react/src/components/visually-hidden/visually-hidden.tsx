import { styled } from "@dreamy-ui/system/jsx";
import { visuallyHidden } from "@dreamy-ui/system/recipes";
import type { ComponentProps } from "react";

export type VisuallyHiddenProps = ComponentProps<typeof VisuallyHidden>;

/**
 * VisuallyHidden component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHidden = styled("span", visuallyHidden);

export type VisuallyHiddenInputProps = ComponentProps<typeof VisuallyHiddenInput>;

/**
 * VisuallyHiddenInput component.
 *
 * @See Docs https://dream-ui.com/docs/components/visually-hidden
 */
export const VisuallyHiddenInput = styled("input", visuallyHidden, {
    defaultProps: {
        readOnly: true
    }
});
