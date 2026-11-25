import { Box, Flex, Grid, Heading, HStack, Text } from "@/ui";

const stats = [
    { value: "60+", label: "Production components" },
    { value: "0 B", label: "Runtime CSS overhead" },
    { value: "100%", label: "Typed tokens & props" },
    { value: "AI-First", label: "MCP, Skills & llms.txt" }
];

export default function BuiltFor() {
    return (
        <Grid
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            bg={"bg.panel/60"}
            border={"1px solid"}
            borderColor={"border"}
            columns={{ base: 2, md: 4 }}
            full
            gap={0}
            overflow={"hidden"}
            rounded={"2xl"}
        >
            {stats.map((s, i) => (
                <Flex
                    borderBottomWidth={{ base: i < 2 ? "1px" : 0, md: 0 }}
                    borderColor={"border"}
                    borderRightWidth={{
                        base: i % 2 === 0 ? "1px" : 0,
                        md: i < stats.length - 1 ? "1px" : 0
                    }}
                    col
                    gap={2}
                    justify={"center"}
                    key={s.label}
                    px={{ base: 5, md: 8 }}
                    py={{ base: 7, md: 9 }}
                >
                    <HStack gap={2}>
                        <Box
                            bg={"primary"}
                            boxSize={"1.5"}
                            rounded={"full"}
                        />
                        <Text
                            color={"fg.medium"}
                            fontFamily={"mono"}
                            letterSpacing={"wider"}
                            size={"xs"}
                            textTransform={"uppercase"}
                        >
                            {s.label}
                        </Text>
                    </HStack>
                    <Heading
                        color={"fg.max"}
                        fontWeight={"bold"}
                        letterSpacing={"tight"}
                        size={{ base: "3xl", md: "4xl" }}
                    >
                        {s.value}
                    </Heading>
                </Flex>
            ))}
        </Grid>
    );
}
