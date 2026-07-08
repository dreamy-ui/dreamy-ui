import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Link } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { MDXRemote } from "next-mdx-remote";
import { BiLogoTypescript } from "react-icons/bi";
import { FaBorderStyle } from "react-icons/fa";
import { LuPaintbrushVertical } from "react-icons/lu";
import { useLoaderData } from "react-router";
import type { Route } from "rr/app/routes/+types/_index";

export default function Features() {
    const data = useLoaderData<Route.ComponentProps["loaderData"]>();

    return (
        <Flex
            col
            full
            gap={0}
        >
            <Grid
                alignItems={"center"}
                backdropBlur={"sm"}
                backdropFilter={"auto"}
                bg={"bg/40"}
                border={"1px solid"}
                borderColor={"border"}
                columns={{ base: 1, xl: 2 }}
                full
                gap={{ base: 10, xl: 20 }}
                overflow={"hidden"}
                p={{ base: 8, md: 12 }}
                rounded={"2xl"}
            >
                {/* Left: Info */}
                <Flex
                    col
                    gap={6}
                >
                    <Flex
                        col
                        gap={2}
                    >
                        <Text
                            color={"warning"}
                            fontFamily={"mono"}
                            fontWeight={"semibold"}
                            letterSpacing={"widest"}
                            size={"xs"}
                            textTransform={"uppercase"}
                        >
                            Styling foundation
                        </Text>
                        <Heading size="4xl">
                            Built on top of{" "}
                            <Link
                                _hover={{
                                    color: {
                                        base: "#facc15",
                                        _dark: "#fde047"
                                    }
                                }}
                                bg={{
                                    base: "#facc15/08",
                                    _dark: "#fde047/12"
                                }}
                                color={{
                                    base: "#facc15",
                                    _dark: "#fde047"
                                }}
                                href="https://panda-css.com"
                                px={2}
                                py={0.5}
                                rounded={"sm"}
                                target="_blank"
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
                        Panda CSS is a powerful, flexible CSS-in-JS library that lets you build
                        performant, build-time styles using style props with no runtime
                        overhead.
                    </Text>

                    <Flex
                        col
                        gap={4}
                    >
                        {[
                            {
                                text: "Recipes.",
                                icon: LuPaintbrushVertical,
                                description: "Generates CSS only for what you use."
                            },
                            {
                                text: "No runtime styles.",
                                icon: FaBorderStyle,
                                description: "Styles are extracted at build time."
                            },
                            {
                                text: "CSS-in-JS DX.",
                                icon: BiLogoTypescript,
                                description:
                                    "Amazing developer experience, best-in-class performance."
                            }
                        ].map((item, i) => (
                            <HStack
                                bg={"bg/60"}
                                border={"1px solid"}
                                borderColor={"border"}
                                gap={3}
                                key={`feature-${i}`}
                                px={4}
                                py={3}
                                rounded={"lg"}
                            >
                                <Flex
                                    align={"center"}
                                    bg={"warning/12"}
                                    boxSize={"9"}
                                    center
                                    rounded={"md"}
                                    shrink={0}
                                >
                                    <Icon
                                        as={item.icon}
                                        boxSize={"4"}
                                        color={"warning"}
                                    />
                                </Flex>
                                <Text
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

                {/* Right: Code */}
                <Flex
                    bg={"bg/80"}
                    border={"1px solid"}
                    borderColor={"border"}
                    col
                    full
                    overflow={"hidden"}
                    rounded={"xl"}
                >
                    <HStack
                        bg={"bg"}
                        borderBottomWidth={"1px"}
                        borderColor={"border"}
                        gap={1.5}
                        px={4}
                        py={3}
                    >
                        <Box
                            bg={"error"}
                            boxSize={"2.5"}
                            opacity={0.7}
                            rounded={"full"}
                        />
                        <Box
                            bg={"warning"}
                            boxSize={"2.5"}
                            opacity={0.7}
                            rounded={"full"}
                        />
                        <Box
                            bg={"success"}
                            boxSize={"2.5"}
                            opacity={0.7}
                            rounded={"full"}
                        />
                    </HStack>
                    <Box
                        fontSize={"sm"}
                        overflow={"auto"}
                        p={5}
                    >
                        {data.panda && <MDXRemote {...data.panda} />}
                    </Box>
                </Flex>
            </Grid>
        </Flex>
    );
}
