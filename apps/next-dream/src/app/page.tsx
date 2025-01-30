"use client";

import {
	Button,
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
	useColorMode
} from "@dreamy-ui/react";
import { Flex, Text } from "@dreamy-ui/react/rsc";

export default function Home() {
	const { toggleColorMode } = useColorMode();

	return (
		<Flex col w={"fit"}>
			<Text>Dreamy UI</Text>
			<Button onClick={toggleColorMode}>Click me</Button>

			<Menu placement="bottom-start">
				<MenuTrigger>
					<Button>Open Menu</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem command="{actionKey} n">Add new</MenuItem>
					<MenuItem command="{actionKey} a">Set alarm</MenuItem>
					<MenuItem command="{actionKey} b">Battery</MenuItem>
					<MenuItem command="{actionKey} d">Delete</MenuItem>
				</MenuContent>
			</Menu>
		</Flex>
	);
}
