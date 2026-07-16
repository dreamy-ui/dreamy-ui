import { Box, Flex, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { colorScales, semanticColorGroups } from "./query";
import { ColorSwatch } from "./shared";

export function TokenColors() {
    return (
        <Flex
            col
            gap={8}
            w={"full"}
        >
            {colorScales.map(function mapScale(scale) {
                return (
                    <Flex
                        col
                        gap={3}
                        key={scale.key}
                        w={"full"}
                    >
                        <Text
                            fontWeight={600}
                            size={"md"}
                        >
                            {scale.key}
                        </Text>
                        <Box
                            css={{
                                display: "grid",
                                gridTemplateColumns: {
                                    base: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))"
                                },
                                gap: 2
                            }}
                            w={"full"}
                        >
                            {scale.tokens.map(function mapToken(colorToken) {
                                return (
                                    <ColorSwatch
                                        color={colorToken.color}
                                        key={colorToken.name}
                                        name={colorToken.name}
                                        value={colorToken.value}
                                    />
                                );
                            })}
                        </Box>
                    </Flex>
                );
            })}
        </Flex>
    );
}

export function TokenSemanticColors() {
    return (
        <Flex
            col
            gap={8}
            w={"full"}
        >
            {semanticColorGroups.map(function mapGroup(group) {
                return (
                    <Flex
                        col
                        gap={3}
                        key={group.key}
                        w={"full"}
                    >
                        <Text
                            fontWeight={600}
                            size={"md"}
                        >
                            {group.key}
                        </Text>
                        <Box
                            css={{
                                display: "grid",
                                gridTemplateColumns: {
                                    base: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))"
                                },
                                gap: 2
                            }}
                            w={"full"}
                        >
                            {group.tokens.map(function mapToken(colorPath) {
                                return (
                                    <ColorSwatch
                                        color={colorPath}
                                        key={colorPath}
                                        name={colorPath}
                                        value={token(`colors.${colorPath}`)}
                                    />
                                );
                            })}
                        </Box>
                    </Flex>
                );
            })}
        </Flex>
    );
}
