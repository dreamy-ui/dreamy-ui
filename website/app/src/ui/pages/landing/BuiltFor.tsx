import { Flex } from "@/flex";
import { Heading } from "@/heading";
import { Text } from "@/text";

export default function BuiltFor() {
	return (
		<Flex col gap={2}>
			<Heading size="xl" textCenter>
				Built for modern, reliable websites
			</Heading>
			<Text size={"lg"} color={"fg.medium"} textCenter>
				Enhance your stack with Dreamy UI
			</Text>
		</Flex>
	);
}
