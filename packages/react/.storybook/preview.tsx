import type { Preview } from "@storybook/react";
import { domMax } from "motion/react";
import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { IconButton } from "../src/components/button/icon-button";
import { Icon } from "../src/components/icon/icon";
import { VStack } from "../src/components/stack/vstack";
import { DreamyProvider, useColorMode } from "../src/provider/dreamy-provider";
import "./index.css";

export default {
	parameters: {
		options: {
			storySort: {
				method: "alphabetical"
			}
		},
		layout: "padded",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	decorators: [
		(Story) => (
			<DreamyProvider motionFeatures={domMax}>
				<VStack gap={4} maxW={"xs"}>
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
		// @ts-ignore - no idea what it is yapping about
		<IconButton
			aria-label="Toggle color mode"
			variant={"ghost"}
			onClick={toggleColorMode}
			aspectRatio={1}
			w={10}
			// @ts-ignore - no idea what it is yapping about
			icon={<Icon as={colorMode === "light" ? BiMoon : BiSun} />}
		/>
	);
}
