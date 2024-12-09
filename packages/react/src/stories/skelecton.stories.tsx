import { HStack, VStack } from "@/components";
import { Skeleton, SkeletonText } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
    title: "Skeleton"
} satisfies Meta;

export function Base() {
    return (
        <VStack
            maxW="300px"
            gap={4}
        >
            <HStack>
                <Skeleton
                    boxSize="10"
                    rounded={"full"}
                />
                <SkeletonText lines={2} />
            </HStack>
            <Skeleton h="150px" />
        </VStack>
    );
}

export function Variants() {
    return (
        <>
            <VStack
                maxW="300px"
                gap={4}
            >
                <HStack>
                    <Skeleton
                        boxSize="10"
                        rounded={"full"}
                    />
                    <SkeletonText lines={2} />
                </HStack>
                <Skeleton h="150px" />
            </VStack>
            <VStack
                maxW="300px"
                gap={4}
            >
                <HStack>
                    <Skeleton
                        variant={"shine"}
                        boxSize="10"
                        rounded={"full"}
                    />
                    <SkeletonText
                        lines={2}
                        variant={"shine"}
                    />
                </HStack>
                <Skeleton
                    h="150px"
                    variant={"shine"}
                />
            </VStack>
            <VStack
                maxW="300px"
                gap={4}
            >
                <HStack>
                    <Skeleton
                        variant={"none"}
                        boxSize="10"
                        rounded={"full"}
                    />
                    <SkeletonText
                        lines={2}
                        variant={"none"}
                    />
                </HStack>
                <Skeleton
                    h="150px"
                    variant={"none"}
                />
            </VStack>
        </>
    );
}
