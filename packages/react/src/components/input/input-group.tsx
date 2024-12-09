"use client";

import { Box, type BoxProps } from "@/components/box";
import { Flex, type FlexProps } from "@/components/flex";
import type { UserFeedbackProps } from "@/components/input/input";
import { createContext } from "@/provider/create-context";
import { copyObjectWithoutKeys } from "@/utils/object";
import type { InputVariantProps } from "@dreamy-ui/system/recipes";
import { type PropsWithChildren, forwardRef, useMemo } from "react";

interface InputGroupProviderContext extends InputVariantProps, UserFeedbackProps {}

export const [InputGroupProvider, useInputGroup] = createContext<InputGroupProviderContext>({
    strict: false,
    name: "InputGroupContext"
});

export interface InputGroupProps extends InputGroupProviderContext {
    /**
     * The props of the `Box` wrapper element.
     */
    wrapperProps?: BoxProps;
}

export const InputGroup = forwardRef<HTMLDivElement, PropsWithChildren<InputGroupProps>>(
    function InputGroup(props, ref) {
        const context = useMemo(
            () => copyObjectWithoutKeys(props, ["wrapperProps", "children"]),
            [props]
        );

        return (
            <InputGroupProvider value={context}>
                <Box
                    css={{
                        width: "100%",
                        display: "flex",
                        position: "relative",
                        // Parts of inputs override z-index to ensure that they stack correctly on each other
                        // Create a new stacking context so that these overrides don't leak out and conflict with other z-indexes
                        isolation: "isolate"
                    }}
                    data-group
                    ref={ref}
                >
                    {props.children}
                </Box>
            </InputGroupProvider>
        );
    }
);

export interface InputAddonProps extends FlexProps {}

const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(function InputAddon(props, ref) {
    return (
        <Flex
            ref={ref}
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                flex: "0 0 auto",
                width: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                paddingInline: "0.75rem"
            }}
            {...props}
        />
    );
});

export const InputLeftAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    function InputLeftAddon(props, ref) {
        return (
            <InputAddon
                ref={ref}
                left={0}
                {...props}
            />
        );
    }
);

export const InputRightAddon = forwardRef<HTMLDivElement, InputAddonProps>(
    function InputRightAddon(props, ref) {
        return (
            <InputAddon
                ref={ref}
                right={0}
                {...props}
            />
        );
    }
);
