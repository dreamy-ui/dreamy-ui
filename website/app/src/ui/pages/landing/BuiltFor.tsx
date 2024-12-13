import { Flex, Heading, Text } from "@dreamy-ui/react/rsc";

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
                size={"lg"}
                color={"fg.medium"}
                textCenter
            >
                Enhance your stack with Dreamy UI
            </Text>
        </Flex>
    );
}
