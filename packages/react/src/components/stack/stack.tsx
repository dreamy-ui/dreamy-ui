import type { HTMLDreamProps } from "@/utils/types";
import { cx } from "@dreamy-ui/system/css";
import type { StackProps as JSXStackProps } from "@dreamy-ui/system/jsx";
import { stack } from "@dreamy-ui/system/patterns";
import React, { forwardRef } from "react";
import { dreamy } from "../factory";

interface Props {
    separator?: React.ReactNode;
}

export interface StackProps
    extends Omit<HTMLDreamProps<"div">, keyof JSXStackProps>,
        JSXStackProps,
        Props {}

const StyledStack = dreamy.div;

/**
 * Stack component.
 *
 * @See Docs https://dream-ui.com/docs/components/stack
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
