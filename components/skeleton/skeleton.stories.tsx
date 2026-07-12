import { Flex, HStack, Skeleton, SkeletonText, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Skeleton"
} satisfies Meta;

export function Base() {
    return (
        <VStack
            gap={4}
            maxW="300px"
            w="full"
        >
            <HStack full>
                <Skeleton
                    boxSize="10"
                    rounded="full"
                />
                <SkeletonText lines={2} />
            </HStack>
            <Skeleton
                full
                h="150px"
            />
        </VStack>
    );
}

export function Variants() {
    return (
        <Flex
            gap={6}
            wrapped
        >
            <Flex
                col
                gap={4}
                w="300px"
            >
                <Text>Pulse</Text>
                <Flex
                    col
                    gap={4}
                >
                    <HStack full>
                        <Skeleton
                            boxSize="10"
                            rounded="full"
                            variant="pulse"
                        />
                        <SkeletonText
                            lines={2}
                            variant="pulse"
                        />
                    </HStack>
                    <Skeleton
                        full
                        h="150px"
                        variant="pulse"
                    />
                </Flex>
            </Flex>

            <Flex
                col
                gap={4}
                w="300px"
            >
                <Text>Shine</Text>
                <Flex
                    col
                    gap={4}
                >
                    <HStack full>
                        <Skeleton
                            boxSize="10"
                            rounded="full"
                            variant="shine"
                        />
                        <SkeletonText
                            lines={2}
                            variant="shine"
                        />
                    </HStack>
                    <Skeleton
                        full
                        h="150px"
                        variant="shine"
                    />
                </Flex>
            </Flex>

            <Flex
                col
                gap={4}
                w="300px"
            >
                <Text>None</Text>
                <Flex
                    col
                    gap={4}
                >
                    <HStack full>
                        <Skeleton
                            boxSize="10"
                            rounded="full"
                            variant="none"
                        />
                        <SkeletonText
                            lines={2}
                            variant="none"
                        />
                    </HStack>
                    <Skeleton
                        full
                        h="150px"
                        variant="none"
                    />
                </Flex>
            </Flex>
        </Flex>
    );
}
