import { splitProps } from "@dreamy-ui/react";
import React, { forwardRef } from "react";
import {
    type HstackProperties,
    type StackProperties,
    type VstackProperties,
    hstack,
    stack,
    vstack
} from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface StackProps
    extends Omit<HTMLDreamyProps<"div">, keyof StackProperties>,
        StackProperties {
    separator?: React.ReactNode;
}

/**
 * Stack component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
    ({ separator, children, ...props }, ref) => {
        const [patternProps, restProps] = splitProps(props, [
            "direction",
            "gap",
            "align",
            "justify"
        ]);

        const styles = stack.raw(patternProps);

        return (
            <dreamy.div
                ref={ref}
                {...styles}
                {...restProps}
            >
                {React.Children.map(children, (child, index) => (
                    <>
                        {child}
                        {separator &&
                            index < React.Children.toArray(children).length - 1 &&
                            separator}
                    </>
                ))}
            </dreamy.div>
        );
    }
);

export interface HStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof HstackProperties>,
        HstackProperties {}
/**
 * HStack component. Stack component with `direction="row"`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(({ children, ...props }, ref) => {
    const [patternProps, restProps] = splitProps(props, ["gap", "justify"]);

    const styles = hstack.raw(patternProps);

    return (
        <dreamy.div
            ref={ref}
            {...styles}
            {...restProps}
        >
            {children}
        </dreamy.div>
    );
});

export interface VStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof VstackProperties>,
        VstackProperties {}

/**
 * VStack component. Stack component with `direction="column"`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const VStack = forwardRef<HTMLDivElement, VStackProps>(({ children, ...props }, ref) => {
    const [patternProps, restProps] = splitProps(props, ["gap", "justify"]);

    const styles = vstack.raw(patternProps);

    return (
        <dreamy.div
            ref={ref}
            {...styles}
            {...restProps}
        >
            {children}
        </dreamy.div>
    );
});
