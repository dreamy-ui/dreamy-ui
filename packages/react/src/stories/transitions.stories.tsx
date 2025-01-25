import { Button, Collapse } from "@/components";
import { Box } from "@/rsc";
import type { Meta } from "@storybook/react";
import { useState } from "react";

export default {
	title: "Transitions"
} satisfies Meta;

export function Collapse_() {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<>
			<Button onClick={() => setIsOpen(!isOpen)}>Toggle</Button>
			<Collapse in={isOpen}>
				<Box h={"100px"} bg={"success"}>
					aaa
				</Box>
			</Collapse>
		</>
	);
}
