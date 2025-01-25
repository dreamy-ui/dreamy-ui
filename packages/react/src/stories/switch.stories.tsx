import { Switch } from "@/components";
import { VStack } from "@/rsc";
import type { Meta } from "@storybook/react";
import { BiPlus } from "react-icons/bi";

export default {
	title: "Switch"
} satisfies Meta;

export function Base() {
	return <Switch>Switch</Switch>;
}

export function Sizes() {
	return (
		<VStack>
			<Switch size="sm">Small</Switch>
			<Switch size="md">Medium</Switch>
			<Switch size="lg">Large</Switch>
		</VStack>
	);
}

export function Schemes() {
	return (
		<VStack>
			<Switch scheme="primary">Primary</Switch>
			<Switch scheme="secondary">Secondary</Switch>
			<Switch scheme="success">Success</Switch>
			<Switch scheme="warning">Warning</Switch>
			<Switch scheme="error">Error</Switch>
			<Switch scheme="info">Info</Switch>
		</VStack>
	);
}

export function CustomIcon() {
	return <Switch icon={BiPlus}>Custom Icon</Switch>;
}
