import { Box, Flex, Text } from "@/ui";
import { useClipboard } from "@dreamy-ui/react";
import type { ColorToken } from "styled-system/tokens";
import { token } from "styled-system/tokens";

interface ColorSwatchProps {
    name: string;
    color: ColorToken;
    value?: string;
}

export function ColorSwatch({ name, color, value }: ColorSwatchProps) {
    const { copy, copied } = useClipboard({ timeout: 1500 });
    const displayValue = value ?? token(`colors.${color}`);

    return (
        <Flex
            _hover={{
                borderColor: "border.hover"
            }}
            align={"center"}
            border={"1px solid"}
            borderColor={"border"}
            cursor={"pointer"}
            gap={3}
            maxW={"full"}
            minW={0}
            onClick={function handleCopy() {
                copy(displayValue);
            }}
            overflow={"hidden"}
            p={2}
            rounded={"l2"}
            title={`Copy ${displayValue}`}
            transition={"colors"}
            w={"full"}
        >
            <Box
                border={"1px solid"}
                borderColor={"border.muted"}
                flexShrink={0}
                h={10}
                rounded={"l1"}
                style={{ backgroundColor: token.var(`colors.${color}`) }}
                w={10}
            />
            <Flex
                col
                flex={1}
                gap={0.5}
                minW={0}
                overflow={"hidden"}
            >
                <Text
                    css={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                    fontWeight={500}
                    size={"sm"}
                >
                    {name}
                </Text>
                <Text
                    color={copied ? "success" : "fg.medium"}
                    css={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                    fontFamily={"mono"}
                    size={"xs"}
                >
                    {copied ? "Copied!" : displayValue}
                </Text>
            </Flex>
        </Flex>
    );
}

interface TokenTableProps {
    rows: Array<{
        name: string;
        value: string;
        pixelValue?: string;
    }>;
    showPixel?: boolean;
}

export function TokenTable({ rows, showPixel = true }: TokenTableProps) {
    return (
        <Flex
            border={"1px solid"}
            borderColor={"border"}
            col
            overflowX={"auto"}
            rounded={"l2"}
            w={"full"}
        >
            <Flex
                bg={"alpha.50"}
                borderBottomWidth={"1px"}
                borderColor={"border"}
                gap={4}
                px={4}
                py={2}
            >
                <Text
                    flex={1}
                    fontWeight={600}
                    minW={"80px"}
                    size={"sm"}
                >
                    Name
                </Text>
                <Text
                    flex={2}
                    fontWeight={600}
                    minW={"120px"}
                    size={"sm"}
                >
                    Value
                </Text>
                {showPixel && (
                    <Text
                        flex={1}
                        fontWeight={600}
                        minW={"80px"}
                        size={"sm"}
                    >
                        Pixel
                    </Text>
                )}
            </Flex>
            {rows.map(function mapRow(row) {
                return (
                    <Flex
                        _last={{ borderBottom: "none" }}
                        align={"center"}
                        borderBottomWidth={"1px"}
                        borderColor={"border"}
                        gap={4}
                        key={row.name}
                        px={4}
                        py={2}
                    >
                        <Text
                            flex={1}
                            fontWeight={500}
                            minW={"80px"}
                            size={"sm"}
                        >
                            {row.name}
                        </Text>
                        <Text
                            color={"fg.medium"}
                            flex={2}
                            fontFamily={"mono"}
                            minW={"120px"}
                            size={"sm"}
                        >
                            {row.value}
                        </Text>
                        {showPixel && (
                            <Text
                                color={"fg.medium"}
                                flex={1}
                                fontFamily={"mono"}
                                minW={"80px"}
                                size={"sm"}
                            >
                                {row.pixelValue ?? "—"}
                            </Text>
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
}
