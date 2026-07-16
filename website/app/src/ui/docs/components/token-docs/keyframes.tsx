import { Box, Flex, Text } from "@/ui";
import { keyframes } from "./query";

const animationStyles: Record<string, Record<string, string | number>> = {
    spin: {
        animation: "spin 1s linear infinite"
    },
    ping: {
        animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"
    },
    bounce: {
        animation: "bounce 1s infinite"
    },
    pulse: {
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    },
    "spinner-spin": {
        animation: "spinner-spin 0.8s linear infinite"
    },
    "progress-spin": {
        animation: "progress-spin 1.4s ease-in-out infinite"
    },
    progress: {
        animation: "progress 1.5s ease-in-out infinite",
        position: "relative"
    },
    stripe: {
        animation: "stripe 1s linear infinite",
        backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
        backgroundSize: "1rem 1rem"
    },
    "bg-position": {
        animation: "bg-position 2s linear infinite",
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent)",
        backgroundSize: "200% 100%"
    }
};

export function TokenKeyframes() {
    return (
        <Box
            css={{
                display: "grid",
                gridTemplateColumns: {
                    base: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)"
                },
                gap: 4
            }}
        >
            {keyframes.map(function mapKeyframe(name) {
                return (
                    <Flex
                        align={"center"}
                        border={"1px solid"}
                        borderColor={"border"}
                        col
                        gap={3}
                        key={name}
                        p={4}
                        rounded={"l2"}
                    >
                        <Flex
                            center
                            h={16}
                            overflow={"hidden"}
                            relative
                            w={"full"}
                        >
                            <Box
                                bg={"primary"}
                                h={10}
                                rounded={"l2"}
                                style={animationStyles[name]}
                                w={10}
                            />
                        </Flex>
                        <Text
                            fontWeight={500}
                            textAlign={"center"}
                        >
                            {name}
                        </Text>
                    </Flex>
                );
            })}
        </Box>
    );
}
