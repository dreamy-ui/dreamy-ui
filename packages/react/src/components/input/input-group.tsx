"use client";

import { Box, type BoxProps } from "@/components/box";
import { Flex, type FlexProps } from "@/components/flex";
import type { UserFeedbackProps } from "@/components/input/input";
import { createContext } from "@/provider/create-context";
import { copyObjectWithoutKeys } from "@/utils/object";
import { splitCssProps } from "@dreamy-ui/system/jsx";
import type { InputVariantProps } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

interface InputGroupProviderContext extends InputVariantProps, UserFeedbackProps {}

export const [InputGroupProvider, useInputGroup] = createContext<InputGroupProviderContext>({
    strict: false,
    name: "InputGroupContext"
});

export interface InputGroupProps extends InputGroupProviderContext, BoxProps {}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
    function InputGroup(props, ref) {
        const [cssProps, rest] = splitCssProps(props);

        return (
            <InputGroupProvider value={copyObjectWithoutKeys(rest, ["children"])}>
                <Box
                    data-input-group={"true"}
                    ref={ref}
                    {...cssProps}
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
                width: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
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
