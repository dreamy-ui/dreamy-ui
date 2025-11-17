"use client";

import { Flex } from "@/components/ui/flex";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { useColorMode } from "@dreamy-ui/react";
import { Moon, Sun } from "lucide-react";
import { m } from "motion/react";

const MotionIconButton = m.create(IconButton);

export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Flex
                // _dark={{ bg: "black" }}
                align={"center"}
                // bg={"gray.50"}
                font={"sans"}
                justify={"center"}
                minH={"screen"}
            >
                <Flex
                    align={"center"}
                    as="main"
                    flexDir={"column"}
                    gap={10}
                    justify={"between"}
                    maxW="3xl"
                    minH="screen"
                    px={16}
                    py={32}
                    sm={{ alignItems: "start" }}
                    w="full"
                >
                    <Image
                        _dark={{
                            filter: "invert(1)"
                        }}
                        alt="Next.js logo"
                        height={5}
                        src="/next.svg"
                        width={20}
                    />
                    <Flex
                        align={"center"}
                        flexDir={"column"}
                        gap={6}
                        sm={{ alignItems: "start", textAlign: "left" }}
                        textAlign={"center"}
                    >
                        <Heading
                            _dark={{ color: "gray.50" }}
                            color={"black"}
                            fontWeight={"semibold"}
                            leading={"tight"}
                            maxW={"xs"}
                            textStyle={"3xl"}
                            tracking={"tight"}
                        >
                            To get started, edit the page.tsx file.
                        </Heading>
                        <Text
                            _dark={{ color: "gray.400" }}
                            color={"gray.600"}
                            lineHeight={"snug"}
                            maxW={"md"}
                            textStyle={"lg"}
                        >
                            Looking for a starting point or more instructions? Head over to{" "}
                            <Link
                                fontWeight={"medium"}
                                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            >
                                Templates
                            </Link>{" "}
                            or the{" "}
                            <Link
                                fontWeight={"medium"}
                                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            >
                                Learning
                            </Link>{" "}
                            center.
                        </Text>
                    </Flex>
                    <Flex
                        col
                        fontWeight={"medium"}
                        gap={4}
                        sm={{ flexDirection: "row" }}
                        textStyle={"base"}
                    >
                        <Link
                            _dark={{ _hover: { bg: "gray.50" } }}
                            _hover={{ bg: "gray.950" }}
                            alignItems={"center"}
                            bg={"fg"}
                            color={"bg"}
                            display={"flex"}
                            gap={2}
                            h={12}
                            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            justifyContent={"center"}
                            px={5}
                            rel="noopener noreferrer"
                            rounded={"full"}
                            sm={{ w: "158px" }}
                            target="_blank"
                            transition={"colors"}
                            w={"full"}
                        >
                            <Image
                                _dark={{
                                    filter: "invert(1)"
                                }}
                                alt="Vercel logomark"
                                boxSize={"4"}
                                src="/vercel.svg"
                            />
                            Deploy Now
                        </Link>
                        <Link
                            _dark={{ _hover: { borderColor: "whiteAlpha.150", bg: "#1a1a1a" } }}
                            _hover={{ borderColor: "transparent", bg: "blackAlpha.400" }}
                            alignItems={"center"}
                            border={1}
                            borderColor={"blackAlpha.800"}
                            display={"flex"}
                            gap={2}
                            h={12}
                            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            justifyContent={"center"}
                            px={5}
                            rel="noopener noreferrer"
                            rounded={"full"}
                            sm={{ w: "158px" }}
                            target="_blank"
                            transition={"colors"}
                            w={"full"}
                        >
                            Documentation
                        </Link>
                    </Flex>
                </Flex>
            </Flex>
            <MotionIconButton
                _hover={{
                    bg: {
                        _dark: "yellow.300/20",
                        base: "purple.600/20"
                    }
                }}
                aria-label="Toggle color mode"
                bg={{
                    _dark: "yellow.300/15",
                    base: "purple.600/15"
                }}
                bottom={5}
                color={{
                    _dark: "yellow.300",
                    base: "purple.600"
                }}
                fixed
                onClick={toggleColorMode}
                right={5}
                rounded={"xl"}
                transition={{
                    duration: 0.1,
                    ease: "easeInOut",
                    delay: 0
                }}
                whileHover={{
                    rotate: colorMode === "light" ? 15 : -15
                }}
            >
                <Icon
                    as={colorMode === "light" ? Sun : Moon}
                    boxSize={"5"}
                />
            </MotionIconButton>
        </>
    );
}
