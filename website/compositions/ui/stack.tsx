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

interface WithSeparator {
    /**
     * The separator to be rendered between the children.
     */
    separator?: React.ReactNode;
}

function renderSeparator(separator: React.ReactNode, children: React.ReactNode) {
    return React.Children.map(children, (child, index) => (
        <>
            {child}
            {separator && index < React.Children.toArray(children).length - 1 && separator}
        </>
    ));
}

export interface StackProps
    extends Omit<HTMLDreamyProps<"div">, keyof StackProperties>,
        StackProperties,
        WithSeparator {}

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
                {renderSeparator(separator, children)}
            </dreamy.div>
        );
    }
);

export interface HStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof HstackProperties>,
        HstackProperties,
        WithSeparator {}
/**
 * Horizontal stack component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(
    ({ children, separator, ...props }, ref) => {
        const [patternProps, restProps] = splitProps(props, ["gap", "justify", "align"]);

        const styles = hstack.raw(patternProps);

        return (
            <dreamy.div
                ref={ref}
                {...styles}
                {...restProps}
            >
                {renderSeparator(separator, children)}
            </dreamy.div>
        );
    }
);

export interface VStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof VstackProperties>,
        VstackProperties,
        WithSeparator {}

/**
 * Vertical stack component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/stack
 */
export const VStack = forwardRef<HTMLDivElement, VStackProps>(
    ({ children, separator, ...props }, ref) => {
        const [patternProps, restProps] = splitProps(props, ["gap", "justify", "align"]);

        const styles = vstack.raw(patternProps);

        return (
            <dreamy.div
                ref={ref}
                {...styles}
                {...restProps}
            >
                {renderSeparator(separator, children)}
            </dreamy.div>
        );
    }
);
