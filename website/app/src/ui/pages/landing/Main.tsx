import { Badge, Box, Button, Flex, Heading, HStack, Text } from "@/ui";
import { useReducedMotion } from "@dreamy-ui/react";
import { m } from "motion/react";
import { IoArrowForward } from "react-icons/io5";
import { LuArrowRight, LuBot, LuSparkles } from "react-icons/lu";
import { Link as RouterLink, useLoaderData } from "react-router";
import type { Route } from "rr/app/routes/+types/_index";
import { Link } from "~/src/ui/global/Link";
import { LandingSnippet } from "./LandingSnippet";

const capabilities = ["React 19", "Panda CSS", "100% TypeScript", "MCP + Skills"];

export default function Main() {
    const { version } = useLoaderData<Route.ComponentProps["loaderData"]>();
    const reduceMotion = useReducedMotion();

    return (
        <Flex
            col
            gap={10}
            maxW={{ base: "full", lg: "2xl" }}
        >
            <Flex
                col
                gap={6}
            >
                <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: 0 }}
                >
                    <Link
                        alignSelf={"flex-start"}
                        display={"inline-flex"}
                        prefetch="intent"
                        rounded={"full"}
                        to="/docs/ai-agents/mcp-server"
                    >
                        <Badge
                            _hover={{
                                bg: "primary/15",
                                borderColor: "primary/40"
                            }}
                            border={"1px solid"}
                            borderColor={"primary/20"}
                            gap={2}
                            px={3}
                            py={1.5}
                            rounded={"full"}
                            scheme={"primary"}
                            textTransform={"none"}
                            transition={"background-color 0.2s, border-color 0.2s"}
                            variant={"subtle"}
                        >
                            <Box
                                as={LuSparkles}
                                boxSize={"3.5"}
                            />
                            v{version} - Built for humans and AI agents
                            <Box
                                as={LuArrowRight}
                                boxSize={"3.5"}
                            />
                        </Badge>
                    </Link>
                </m.div>

                <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: 0.06 }}
                >
                    <Flex
                        col
                        gap={4}
                    >
                        <Heading
                            color={"fg.max"}
                            fontWeight={"bold"}
                            letterSpacing={"tight"}
                            lineHeight={"1.08"}
                            size={{
                                base: "4xl",
                                sm: "5xl",
                                md: "6xl"
                            }}
                        >
                            Craft interfaces
                            <br />
                            for humans{" "}
                            <Box
                                as={"span"}
                                gradientFrom={"primary"}
                                gradientTo={"secondary"}
                                textGradient={"to-r"}
                            >
                                and AI agents
                            </Box>
                        </Heading>

                        <Text
                            color="fg.medium"
                            lineHeight={"relaxed"}
                            maxW={"xl"}
                            size="lg"
                        >
                            60+ accessible React components powered by Panda CSS. Zero runtime
                            overhead, full semantic token control, and native MCP, Skills, and
                            llms.txt support out of the box.
                        </Text>
                    </Flex>
                </m.div>

                <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                >
                    <HStack
                        gap={3}
                        wrapped
                    >
                        <Button
                            px={6}
                            render={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/guide/introduction"
                                />
                            }
                            rightIcon={<IoArrowForward />}
                            size={"xl"}
                            variant={"primary"}
                        >
                            Get Started
                        </Button>
                        <Button
                            leftIcon={<LuBot />}
                            px={6}
                            render={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/ai-agents/mcp-server"
                                />
                            }
                            size={"xl"}
                            variant={"outline"}
                        >
                            AI Agents Setup
                        </Button>
                    </HStack>
                </m.div>
            </Flex>

            <m.div
                animate={{ opacity: 1, y: 0 }}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                transition={{ duration: 0.4, delay: 0.18 }}
            >
                <Flex
                    col
                    gap={4}
                >
                    <LandingSnippet />

                    <HStack
                        flexWrap={"wrap"}
                        gap={4}
                    >
                        {capabilities.map((label) => (
                            <HStack
                                gap={2}
                                key={label}
                            >
                                <Box
                                    bg={"primary"}
                                    boxSize={"1.5"}
                                    rounded={"full"}
                                />
                                <Text
                                    color={"fg.medium"}
                                    fontFamily={"mono"}
                                    size={"xs"}
                                >
                                    {label}
                                </Text>
                            </HStack>
                        ))}
                    </HStack>
                </Flex>
            </m.div>
        </Flex>
    );
}
