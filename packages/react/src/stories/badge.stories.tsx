import { Badge, Flex } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Badge"
} satisfies Meta;

export function Base() {
	return <Badge>Badge</Badge>;
}

export function Variants() {
	return (
		<Flex wrapped gap={2}>
			<Badge variant={"outline"}>Outline</Badge>
			<Badge variant={"subtle"}>Subtle</Badge>
		</Flex>
	);
}

export function Schemes() {
	return (
		<Flex wrapped gap={2}>
			<Badge scheme={"primary"}>Primary</Badge>
			<Badge scheme={"secondary"}>Secondary</Badge>
			<Badge scheme={"success"}>Success</Badge>
			<Badge scheme={"warning"}>Warning</Badge>
			<Badge scheme={"error"}>Error</Badge>
			<Badge scheme={"info"}>Info</Badge>
		</Flex>
	);
}

export function NoChildren() {
	return <Badge />;
}
