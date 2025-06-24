import React, { forwardRef } from "react";
import { cx } from "styled-system/css";
import { type StackProperties, stack } from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface StackProps
    extends Omit<HTMLDreamyProps<"div">, keyof StackProperties>,
        StackProperties {
    separator?: React.ReactNode;
}

const StyledStack = dreamy.div;

/**
 * Stack component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
    ({ separator, direction = "row", children, className, ...props }, ref) => {
        return (
            <StyledStack
                ref={ref}
                className={cx(
                    stack({
                        direction,
                        alignItems: direction === "row" ? "center" : undefined
                    }),
                    className
                )}
                {...props}
            >
                {React.Children.map(children, (child, index) => (
                    <>
                        {child}
                        {separator &&
                            index < React.Children.toArray(children).length - 1 &&
                            separator}
                    </>
                ))}
            </StyledStack>
        );
    }
);

export interface HStackProps extends Omit<StackProps, "direction"> {}

/**
 * HStack component. Stack component with `direction="row"`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(({ children, ...props }, ref) => {
    return (
        <Stack
            ref={ref}
            direction={"row"}
            {...props}
        >
            {children}
        </Stack>
    );
});

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
