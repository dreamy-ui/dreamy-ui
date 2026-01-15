import { Icon, IconButton, VStack } from "@/ui";
import { DreamyProvider, useColorMode } from "@dreamy-ui/react";
import type { StorybookConfig } from "@storybook/react-vite";
import type { Preview } from "@storybook/react-vite";
import { domMax } from "motion/react";
import { BiMoon, BiSun } from "react-icons/bi";
import "./index.css";

export default {
    // options: {

    // },
    // layout: "padded",
    // controls: {
    //     matchers: {
    //         color: /(background|color)$/i,
    //         date: /Date$/i
    //     }
    // }
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        }
    },
    decorators: [
        (Story) => (
            <DreamyProvider
                colorMode="light"
                motionFeatures={domMax}
            >
                <VStack
                    gap={4}
                    maxW={"xs"}
                >
                    <ToggleColorModeButton />
                    <Story />
                </VStack>
            </DreamyProvider>
        )
    ]
} satisfies Preview;

function ToggleColorModeButton() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <IconButton
            aria-label="Toggle color mode"
            aspectRatio={1}
            icon={<Icon as={colorMode === "light" ? BiMoon : BiSun} />}
            onClick={toggleColorMode}
            variant={"ghost"}
            w={10}
        />
    );
}
