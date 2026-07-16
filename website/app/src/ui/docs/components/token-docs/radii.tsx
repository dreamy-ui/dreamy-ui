import { Box, Flex, Span, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { radii, semanticRadii } from "./query";

export function TokenRadii() {
    return (
        <Flex
            col
            gap={8}
            w={"full"}
        >
            <Flex
                col
                gap={3}
            >
                <Text fontWeight={600}>Design tokens</Text>
                <Box
                    css={{
                        display: "grid",
                        gridTemplateColumns: {
                            base: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)"
                        },
                        gap: 3
                    }}
                >
                    {radii.map(function mapRadius(item) {
                        return (
                            <Flex
                                align={"center"}
                                border={"1px solid"}
                                borderColor={"border"}
                                gap={3}
                                key={item.name}
                                p={3}
                                rounded={"l2"}
                            >
                                <Box
                                    bg={"primary"}
                                    flexShrink={0}
                                    h={12}
                                    style={{ borderRadius: token.var(`radii.${item.path}`) }}
                                    w={12}
                                />
                                <Flex
                                    col
                                    gap={0.5}
                                    minW={0}
                                >
                                    <Text fontWeight={500}>{item.name}</Text>
                                    <Text
                                        color={"fg.medium"}
                                        fontFamily={"mono"}
                                        size={"sm"}
                                    >
                                        {item.value}
                                        {item.pixelValue ? ` (${item.pixelValue})` : ""}
                                    </Text>
                                </Flex>
                            </Flex>
                        );
                    })}
                </Box>
            </Flex>

            <Flex
                col
                gap={3}
            >
                <Text fontWeight={600}>Semantic tokens</Text>
                <Text
                    color={"fg.medium"}
                    size={"sm"}
                >
                    Generated from the <Span fontFamily={"mono"}>rounded</Span> option in{" "}
                    <Span fontFamily={"mono"}>createDreamyPreset</Span>. Use these for component
                    radii.
                </Text>
                <Box
                    css={{
                        display: "grid",
                        gridTemplateColumns: {
                            base: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)"
                        },
                        gap: 3
                    }}
                >
                    {semanticRadii.map(function mapSemanticRadius(item) {
                        return (
                            <Flex
                                align={"center"}
                                border={"1px solid"}
                                borderColor={"border"}
                                gap={3}
                                key={item.name}
                                p={3}
                                rounded={"l2"}
                            >
                                <Box
                                    bg={"primary"}
                                    flexShrink={0}
                                    h={12}
                                    style={{ borderRadius: token.var(`radii.${item.path}`) }}
                                    w={12}
                                />
                                <Flex
                                    col
                                    gap={0.5}
                                    minW={0}
                                >
                                    <Text fontWeight={500}>{item.name}</Text>
                                    <Text
                                        color={"fg.medium"}
                                        fontFamily={"mono"}
                                        size={"sm"}
                                    >
                                        {item.value}
                                        {item.pixelValue ? ` (${item.pixelValue})` : ""}
                                    </Text>
                                </Flex>
                            </Flex>
                        );
                    })}
                </Box>
            </Flex>
        </Flex>
    );
}
