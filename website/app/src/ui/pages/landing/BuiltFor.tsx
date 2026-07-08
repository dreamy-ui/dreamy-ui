import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Text } from "@/ui";

const stats = [
    { value: "60+", label: "Components" },
    { value: "100%", label: "TypeScript" },
    { value: "Zero", label: "Runtime CSS" },
    { value: "WCAG", label: "Accessible" }
];

export default function BuiltFor() {
    return (
        <Flex
            col
            full
            gap={10}
        >
            <Flex
                col
                gap={3}
                itemsCenter
                textCenter
            >
                <Text
                    color={"primary"}
                    fontFamily={"mono"}
                    fontWeight={"semibold"}
                    letterSpacing={"widest"}
                    size={"xs"}
                    textTransform={"uppercase"}
                >
                    By the numbers
                </Text>
                <Heading
                    size="4xl"
                    textCenter
                >
                    Built for modern, reliable websites
                </Heading>
                <Text
                    color={"fg.medium"}
                    maxW={"xl"}
                    size={"lg"}
                    textCenter
                >
                    Everything you need to ship production-quality interfaces without the
                    compromises.
                </Text>
            </Flex>

            <Grid
                backdropBlur={"sm"}
                backdropFilter={"auto"}
                bg={"bg/40"}
                border={"1px solid"}
                borderColor={"border"}
                columns={{ base: 2, md: 4 }}
                full
                gap={0}
                overflow={"hidden"}
                rounded={"xl"}
            >
                {stats.map((s, i) => (
                    <Flex
                        borderColor={"border"}
                        borderRightWidth={i < stats.length - 1 ? "1px" : 0}
                        center
                        col
                        gap={1}
                        key={s.label}
                        pos={"relative"}
                        px={6}
                        py={10}
                    >
                        <Box
                            bg={"primary"}
                            blur={"60px"}
                            filter={"auto"}
                            h={"100px"}
                            inset={0}
                            opacity={0.04}
                            pos={"absolute"}
                            rounded={"full"}
                            style={{ margin: "auto" }}
                            w={"100px"}
                        />
                        <Heading
                            fontWeight={"bold"}
                            gradientFrom={"primary"}
                            gradientTo={"secondary"}
                            size={"5xl"}
                            textGradient={"to-br"}
                        >
                            {s.value}
                        </Heading>
                        <Text
                            color={"fg.subtle"}
                            fontFamily={"mono"}
                            letterSpacing={"widest"}
                            size={"xs"}
                            textTransform={"uppercase"}
                        >
                            {s.label}
                        </Text>
                    </Flex>
                ))}
            </Grid>
        </Flex>
    );
}
