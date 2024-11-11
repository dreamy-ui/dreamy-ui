import { Box, Flex, Heading, Text } from "@dreamy-ui/react/rsc";

export default function Features() {
    const features = [
        {
            title: "Feature 1",
            description: "Description 1"
        },
        {
            
        }
    ];

    return (
        <Flex
            col
            wFull
        >
            <Heading>What is Dreamy UI?</Heading>
            <Box
                display="grid"
                gap={6}
                itemsCenter
                py={12}
                lg={{
                    gridTemplateColumns: "repeat(2, 1fr)"
                }}
            >
                {features.map((feature) => (
                    <Box key={feature.title}>
                        <Heading>{feature.title}</Heading>
                        <Text>{feature.description}</Text>
                    </Box>
                ))}
            </Box>
        </Flex>
    );
}
