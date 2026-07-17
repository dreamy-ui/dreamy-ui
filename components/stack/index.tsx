import { splitProps } from "@dreamy-ui/react/rsc";
import React from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import {
    type HstackProperties,
    type StackProperties,
    type VstackProperties,
    hstack,
    stack,
    vstack
} from "styled-system/patterns";

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
 * Stack component — stacks children vertically or horizontally.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stack
 *
 * @example
 * ```tsx
 * <Stack gap="4">
 *   <Box>First</Box>
 *   <Box>Second</Box>
 * </Stack>
 * ```
 */
export function Stack({ separator, children, ...props }: StackProps) {
    const [patternProps, restProps] = splitProps(props, ["direction", "gap", "align", "justify"]);

    const styles = stack.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        >
            {renderSeparator(separator, children)}
        </dreamy.div>
    );
}

export interface HStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof HstackProperties>,
        HstackProperties,
        WithSeparator {}
/**
 * HStack component — horizontal stack layout.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stack
 *
 * @example
 * ```tsx
 * <HStack gap="4">
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </HStack>
 * ```
 */
export function HStack({ children, separator, ...props }: HStackProps) {
    const [patternProps, restProps] = splitProps(props, ["gap", "justify", "align"]);

    const styles = hstack.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        >
            {renderSeparator(separator, children)}
        </dreamy.div>
    );
}

export interface VStackProps
    extends Omit<HTMLDreamyProps<"div">, keyof VstackProperties>,
        VstackProperties,
        WithSeparator {}

/**
 * VStack component — vertical stack layout.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stack
 *
 * @example
 * ```tsx
 * <VStack gap="4" align="start">
 *   <Heading>Title</Heading>
 *   <Text>Description</Text>
 * </VStack>
 * ```
 */
export function VStack({ children, separator, ...props }: VStackProps) {
    const [patternProps, restProps] = splitProps(props, ["gap", "justify", "align"]);

    const styles = vstack.raw(patternProps);

    return (
        <dreamy.div
            {...styles}
            {...restProps}
        >
            {renderSeparator(separator, children)}
        </dreamy.div>
    );
}
