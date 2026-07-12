import { Flex } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Flex"
} satisfies Meta;

export function Base() {
    return (
        <Flex
            color="white"
            h="100px"
            w="full"
        >
            <Flex
                bg="green.400"
                center
                color="black/87"
                w="100px"
            >
                1
            </Flex>
            <Flex
                bg="blue.400"
                center
                w="1/3"
            >
                2
            </Flex>
            <Flex
                bg="purple.400"
                center
                flex={1}
            >
                3
            </Flex>
        </Flex>
    );
}

export function Direction() {
    return (
        <Flex
            direction="column"
            full
            gap={4}
        >
            {Array.from({ length: 3 }).map((_, i) => (
                <Flex
                    bg="green.400"
                    color="black/87"
                    key={i}
                    p={2}
                    w="full"
                >
                    {i}
                </Flex>
            ))}
        </Flex>
    );
}

export function Align() {
    return (
        <Flex
            align="center"
            full
            gap={4}
        >
            <Flex
                bg="green.400"
                center
                color="black/87"
                h="4"
                w="100px"
            >
                1
            </Flex>
            <Flex
                bg="green.400"
                center
                color="black/87"
                h="6"
                w="100px"
            >
                2
            </Flex>
            <Flex
                bg="green.400"
                center
                color="black/87"
                h="8"
                w="100px"
            >
                3
            </Flex>
        </Flex>
    );
}

export function Justify() {
    return (
        <Flex
            full
            gap={4}
            justify="center"
        >
            {Array.from({ length: 3 }).map((_, i) => (
                <Flex
                    bg="green.400"
                    center
                    color="black/87"
                    key={i}
                    p={2}
                    w="100px"
                >
                    {i}
                </Flex>
            ))}
        </Flex>
    );
}

export function Gap() {
    return (
        <Flex
            full
            gap={10}
        >
            {Array.from({ length: 3 }).map((_, i) => (
                <Flex
                    bg="green.400"
                    center
                    color="black/87"
                    key={i}
                    p={2}
                    w="100px"
                >
                    {i}
                </Flex>
            ))}
        </Flex>
    );
}

export function Wrap() {
    return (
        <Flex
            full
            gap={4}
            wrap="wrap"
        >
            {Array.from({ length: 10 }).map((_, i) => (
                <Flex
                    bg="green.400"
                    center
                    color="black/87"
                    key={i}
                    p={2}
                    w="100px"
                >
                    {i}
                </Flex>
            ))}
        </Flex>
    );
}
