import { Box, Flex, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { aspectRatios, blurs, durations, easings, zIndexes } from "./query";
import { TokenTable } from "./shared";

export function TokenBlurs() {
    return (
        <Box
            css={{
                display: "grid",
                gridTemplateColumns: {
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)"
                },
                gap: 4
            }}
        >
            {blurs.map(function mapBlur(item) {
                return (
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        col
                        gap={3}
                        key={item.name}
                        overflow={"hidden"}
                        p={4}
                        rounded={"l2"}
                    >
                        <Flex
                            center
                            h={20}
                            overflow={"hidden"}
                            relative
                            rounded={"l1"}
                        >
                            <Box
                                bg={"primary"}
                                h={16}
                                rounded={"full"}
                                w={16}
                            />
                            <Box
                                absolute
                                bg={"bg/40"}
                                inset={0}
                                style={{
                                    backdropFilter: `blur(${token.var(`blurs.${item.path}`)})`
                                }}
                            />
                        </Flex>
                        <Flex
                            col
                            gap={0.5}
                        >
                            <Text fontWeight={500}>{item.name}</Text>
                            <Text
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                size={"sm"}
                            >
                                {item.value}
                            </Text>
                        </Flex>
                    </Flex>
                );
            })}
        </Box>
    );
}

export function TokenDurations() {
    return (
        <TokenTable
            rows={durations}
            showPixel={false}
        />
    );
}

export function TokenEasings() {
    return (
        <TokenTable
            rows={easings}
            showPixel={false}
        />
    );
}

export function TokenZIndex() {
    return (
        <TokenTable
            rows={zIndexes}
            showPixel={false}
        />
    );
}

export function TokenAspectRatios() {
    return (
        <Box
            css={{
                display: "grid",
                gridTemplateColumns: {
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)"
                },
                gap: 4
            }}
        >
            {aspectRatios.map(function mapAspectRatio(item) {
                return (
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        col
                        gap={3}
                        key={item.name}
                        p={4}
                        rounded={"l2"}
                    >
                        <Box
                            bg={"alpha.100"}
                            border={"1px solid"}
                            borderColor={"border"}
                            rounded={"l1"}
                            style={{ aspectRatio: token.var(`aspectRatios.${item.path}`) }}
                            w={"full"}
                        />
                        <Flex
                            col
                            gap={0.5}
                        >
                            <Text fontWeight={500}>{item.name}</Text>
                            <Text
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                size={"sm"}
                            >
                                {item.value}
                            </Text>
                        </Flex>
                    </Flex>
                );
            })}
        </Box>
    );
}
