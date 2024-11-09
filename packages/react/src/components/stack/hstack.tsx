import { forwardRef } from "react";
import { Stack, type StackProps } from "./stack";

export interface HStackProps extends Omit<StackProps, "direction"> {}

/**
 * HStack component. Stack component with `direction="row"`.
 *
 * @See Docs https://dream-ui.com/docs/components/stack
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(({ children, ...props }, ref) => {
    return (
        <Stack ref={ref} direction={"row"} {...props}>
            {children}
        </Stack>
    );
});
