import { Box, Flex, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { shadows } from "./query";

export function TokenShadows() {
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
            {shadows.map(function mapShadow(item) {
                return (
                    <Flex
                        align={"center"}
                        bg={"bg"}
                        border={"1px solid"}
                        borderColor={"border.muted"}
                        col
                        gap={3}
                        key={item.name}
                        p={4}
                        rounded={"l2"}
                    >
                        <Box
                            bg={"bg"}
                            h={16}
                            rounded={"l2"}
                            style={{ boxShadow: token.var(`shadows.${item.path}`) }}
                            w={"full"}
                        />
                        <Flex
                            col
                            gap={0.5}
                            w={"full"}
                        >
                            <Text fontWeight={500}>{item.name}</Text>
                            <Text
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                size={"xs"}
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
