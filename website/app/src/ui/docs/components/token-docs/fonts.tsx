import { Flex, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { fonts } from "./query";

export function TokenFonts() {
    return (
        <Flex
            col
            gap={4}
            w={"full"}
        >
            {fonts.map(function mapFont(item) {
                return (
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        col
                        gap={2}
                        key={item.name}
                        p={4}
                        rounded={"l2"}
                    >
                        <Text
                            size={"3xl"}
                            style={{ fontFamily: token.var(`fonts.${item.path}`) }}
                        >
                            Ag
                        </Text>
                        <Text fontWeight={600}>{item.name}</Text>
                        <Text
                            color={"fg.medium"}
                            fontFamily={"mono"}
                            size={"sm"}
                        >
                            {item.value}
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}
