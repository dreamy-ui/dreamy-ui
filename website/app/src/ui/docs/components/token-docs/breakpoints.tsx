import { Box, Flex, Text } from "@/ui";
import { breakpoints } from "./query";

export function TokenBreakpoints() {
    return (
        <Flex
            col
            gap={3}
            w={"full"}
        >
            {Object.entries(breakpoints).map(function mapBreakpoint([key, value], index) {
                const widthPercent = Math.min(100, (index + 1) * 18);

                return (
                    <Flex
                        align={"center"}
                        gap={4}
                        key={key}
                        w={"full"}
                    >
                        <Box
                            borderBottomWidth={"12px"}
                            borderColor={"border"}
                            borderTopWidth={"4px"}
                            borderXWidth={"4px"}
                            h={12}
                            rounded={"l1"}
                            style={{ width: `${widthPercent}%` }}
                        />
                        <Flex
                            col
                            flexShrink={0}
                            gap={0.5}
                            minW={"140px"}
                        >
                            <Text fontWeight={600}>{key}</Text>
                            <Text
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                size={"sm"}
                            >
                                {`@media screen (min-width >= ${value})`}
                            </Text>
                        </Flex>
                    </Flex>
                );
            })}
        </Flex>
    );
}
