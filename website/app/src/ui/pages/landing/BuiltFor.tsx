import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { Text } from "@/ui";

export default function BuiltFor() {
    return (
        <Flex
            col
            gap={2}
        >
            <Heading
                size="xl"
                textCenter
            >
                Built for modern, reliable websites
            </Heading>
            <Text
                color={"fg.medium"}
                size={"lg"}
                textCenter
            >
                Enhance your stack with Dreamy UI
            </Text>
        </Flex>
    );
}
