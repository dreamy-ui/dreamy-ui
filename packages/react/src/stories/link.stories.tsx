import { Link } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Link"
} satisfies Meta;

export function Base() {
	return <Link href={"#"}>Ctrl</Link>;
}

export function External() {
	return (
		<Link href={"https://www.google.com"} isExternal>
			Google
		</Link>
	);
}
