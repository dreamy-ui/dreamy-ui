import { Flex, Text } from "@/ui";
import { token } from "styled-system/tokens";
import { fontSizes, fontWeights, letterSpacings, lineHeights } from "./query";

export function TokenFontSizes() {
    return (
        <Flex
            col
            gap={3}
            w={"full"}
        >
            {fontSizes.map(function mapFontSize(item) {
                return (
                    <Flex
                        align={"center"}
                        border={"1px solid"}
                        borderColor={"border"}
                        gap={4}
                        key={item.name}
                        p={3}
                        rounded={"l2"}
                    >
                        <Text
                            flexShrink={0}
                            fontWeight={500}
                            minW={"48px"}
                            size={"sm"}
                        >
                            {item.name}
                        </Text>
                        <Text
                            color={"fg.medium"}
                            flexShrink={0}
                            fontFamily={"mono"}
                            minW={"100px"}
                            size={"sm"}
                        >
                            {item.value}
                        </Text>
                        <Text
                            lineHeight={1}
                            style={{ fontSize: token.var(`fontSizes.${item.path}`) }}
                        >
                            Ag
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}

export function TokenFontWeights() {
    return (
        <Flex
            col
            gap={3}
            w={"full"}
        >
            {fontWeights.map(function mapFontWeight(item) {
                return (
                    <Flex
                        align={"baseline"}
                        border={"1px solid"}
                        borderColor={"border"}
                        gap={4}
                        key={item.name}
                        p={3}
                        rounded={"l2"}
                    >
                        <Text
                            flexShrink={0}
                            fontWeight={500}
                            minW={"100px"}
                        >
                            {item.name}
                        </Text>
                        <Text
                            color={"fg.medium"}
                            flexShrink={0}
                            fontFamily={"mono"}
                            minW={"48px"}
                            size={"sm"}
                        >
                            {item.value}
                        </Text>
                        <Text
                            size={"lg"}
                            style={{ fontWeight: token.var(`fontWeights.${item.path}`) }}
                        >
                            The quick brown fox
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}

export function TokenLetterSpacings() {
    return (
        <Flex
            col
            gap={3}
            w={"full"}
        >
            {letterSpacings.map(function mapLetterSpacing(item) {
                return (
                    <Flex
                        align={"baseline"}
                        border={"1px solid"}
                        borderColor={"border"}
                        gap={4}
                        key={item.name}
                        p={3}
                        rounded={"l2"}
                    >
                        <Text
                            flexShrink={0}
                            fontWeight={500}
                            minW={"80px"}
                        >
                            {item.name}
                        </Text>
                        <Text
                            color={"fg.medium"}
                            flexShrink={0}
                            fontFamily={"mono"}
                            minW={"80px"}
                            size={"sm"}
                        >
                            {item.value}
                        </Text>
                        <Text
                            size={"lg"}
                            style={{ letterSpacing: token.var(`letterSpacings.${item.path}`) }}
                        >
                            Tracking
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}

export function TokenLineHeights() {
    return (
        <Flex
            col
            gap={3}
            w={"full"}
        >
            {lineHeights.map(function mapLineHeight(item) {
                return (
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        gap={4}
                        key={item.name}
                        p={3}
                        rounded={"l2"}
                    >
                        <Flex
                            col
                            flexShrink={0}
                            gap={0.5}
                            minW={"100px"}
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
                        <Text
                            maxW={"sm"}
                            style={{ lineHeight: token.var(`lineHeights.${item.path}`) }}
                        >
                            Dreamy UI tokens keep spacing, type, and color consistent across your
                            entire design system.
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}
