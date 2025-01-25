import { forwardRef } from "react";
import { Stack, type StackProps } from "./stack";

export interface VStackProps extends Omit<StackProps, "direction"> {}

/**
 * VStack component. Stack component with `direction="column"`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const VStack = forwardRef<HTMLDivElement, VStackProps>(({ children, ...props }, ref) => {
    return (
        <Stack
            ref={ref}
            direction={"column"}
            {...props}
        >
            {children}
        </Stack>
    );
});
