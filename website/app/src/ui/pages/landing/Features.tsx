import { Box, Button, Flex, Grid, Heading, HStack, Icon, Link, Text } from "@/ui";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import { BiLogoTypescript } from "react-icons/bi";
import { FaBorderStyle } from "react-icons/fa";
import { LuPaintbrushVertical } from "react-icons/lu";
import { useLoaderData } from "react-router";
import type { Route } from "rr/app/routes/+types/_index";

const highlights = [
    {
        text: "Slot & config recipes.",
        icon: LuPaintbrushVertical,
        description: "Generates CSS only for the variants you use."
    },
    {
        text: "Zero runtime styles.",
        icon: FaBorderStyle,
        description: "All styles are extracted statically at build time."
    },
    {
        text: "Typed JSX style props.",
        icon: BiLogoTypescript,
        description: "Ergonomic developer experience with full TypeScript safety."
    }
];

export default function Features() {
    const data = useLoaderData<Route.ComponentProps["loaderData"]>();
    const [activeFile, setActiveFile] = useState<"panda" | "theme">("panda");

    return (
        <Grid
            alignItems={"center"}
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            bg={"bg.panel/60"}
            border={"1px solid"}
            borderColor={"border"}
            columns={{ base: 1, xl: 12 }}
            full
            gap={{ base: 8, xl: 12 }}
            overflow={"hidden"}
            p={{ base: 6, md: 10 }}
            rounded={"2xl"}
        >
            {/* Left: Info */}
            <Flex
                col
                gap={6}
                gridColumn={{ base: "span 1", xl: "span 5" }}
            >
                <Flex
                    col
                    gap={2}
                >
                    <Text
                        color={"primary"}
                        fontFamily={"mono"}
                        fontWeight={"semibold"}
                        letterSpacing={"widest"}
                        size={"xs"}
                        textTransform={"uppercase"}
                    >
                        Styling Foundation
                    </Text>
                    <Heading
                        color={"fg.max"}
                        letterSpacing={"tight"}
                        size={{ base: "3xl", md: "4xl" }}
                    >
                        Powered by{" "}
                        <Link
                            _hover={{
                                bg: "primary/16"
                            }}
                            bg={"primary/10"}
                            color={"primary"}
                            href="https://panda-css.com"
                            px={2.5}
                            py={0.5}
                            rounded={"md"}
                            target="_blank"
                            transition={"background-color 0.2s"}
                        >
                            Panda CSS
                        </Link>
                    </Heading>
                </Flex>

                <Text
                    color={"fg.medium"}
                    lineHeight={"relaxed"}
                    size={"lg"}
                >
                    Write expressive JSX style props with full TypeScript autocomplete while Panda
                    compiles every style to atomic CSS at build time.
                </Text>

                <Flex
                    col
                    gap={3}
                >
                    {highlights.map((item) => (
                        <HStack
                            bg={"bg/70"}
                            border={"1px solid"}
                            borderColor={"border"}
                            gap={3}
                            key={item.text}
                            px={4}
                            py={3}
                            rounded={"xl"}
                        >
                            <Flex
                                align={"center"}
                                bg={"primary/10"}
                                boxSize={"9"}
                                center
                                rounded={"lg"}
                                shrink={0}
                            >
                                <Icon
                                    as={item.icon}
                                    boxSize={"4"}
                                    color={"primary"}
                                />
                            </Flex>
                            <Text
                                color={"fg.max"}
                                fontWeight={"medium"}
                                size={"sm"}
                            >
                                {item.text}{" "}
                                <Box
                                    as={"span"}
                                    color={"fg.medium"}
                                    fontWeight={"normal"}
                                >
                                    {item.description}
                                </Box>
                            </Text>
                        </HStack>
                    ))}
                </Flex>
            </Flex>

            {/* Right: Code preview */}
            <Flex
                bg={"bg"}
                border={"1px solid"}
                borderColor={"border"}
                col
                full
                gridColumn={{ base: "span 1", xl: "span 7" }}
                overflow={"hidden"}
                rounded={"xl"}
            >
                <HStack
                    bg={"bg.panel/80"}
                    borderBottomWidth={"1px"}
                    borderColor={"border"}
                    contentBetween
                    px={4}
                    py={2.5}
                >
                    <HStack gap={1.5}>
                        <Box
                            bg={"alpha.200"}
                            boxSize={"2.5"}
                            rounded={"full"}
                        />
                        <Box
                            bg={"alpha.200"}
                            boxSize={"2.5"}
                            rounded={"full"}
                        />
                        <Box
                            bg={"alpha.200"}
                            boxSize={"2.5"}
                            rounded={"full"}
                        />
                    </HStack>

                    <HStack gap={1.5}>
                        <Button
                            bg={activeFile === "panda" ? "primary/10" : "transparent"}
                            color={activeFile === "panda" ? "primary" : "fg.medium"}
                            fontFamily={"mono"}
                            onClick={() => setActiveFile("panda")}
                            px={2.5}
                            py={1}
                            rounded={"md"}
                            size={"xs"}
                            variant={"ghost"}
                        >
                            Card.tsx
                        </Button>
                        <Button
                            bg={activeFile === "theme" ? "primary/10" : "transparent"}
                            color={activeFile === "theme" ? "primary" : "fg.medium"}
                            fontFamily={"mono"}
                            onClick={() => setActiveFile("theme")}
                            px={2.5}
                            py={1}
                            rounded={"md"}
                            size={"xs"}
                            variant={"ghost"}
                        >
                            panda.config.ts
                        </Button>
                    </HStack>
                </HStack>

                <Box
                    fontSize={"sm"}
                    overflow={"auto"}
                    p={5}
                >
                    {activeFile === "panda" && data.panda && <MDXRemote {...data.panda} />}
                    {activeFile === "theme" && data.theme && <MDXRemote {...data.theme} />}
                </Box>
            </Flex>
        </Grid>
    );
}
