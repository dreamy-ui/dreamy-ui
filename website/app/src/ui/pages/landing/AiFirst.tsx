import { Badge, Box, Button, Flex, Grid, Heading, HStack, Icon, Snippet, Tabs, Text } from "@/ui";
import { useReducedMotion } from "@dreamy-ui/react";
import { m } from "motion/react";
import { MDXRemote } from "next-mdx-remote";
import { useEffect, useState } from "react";
import { LuArrowUpRight, LuBot, LuCpu, LuFileText, LuLayers, LuTerminal } from "react-icons/lu";
import { useLoaderData } from "react-router";
import type { Route } from "rr/app/routes/+types/_index";
import { Link } from "~/src/ui/global/Link";
import { PmCommandSnippet } from "./LandingSnippet";

const capabilities = [
    {
        title: "MCP Server (@dreamy-ui/mcp)",
        description:
            "Exposes list_components, get_component, get_component_examples, and get_doc over stdio so coding agents inspect real props and variants before writing JSX.",
        href: "/docs/ai-agents/mcp-server",
        badge: "Protocol",
        icon: LuCpu,
        accent: "primary" as const
    },
    {
        title: "Agent Skills (dreamy add-skill)",
        description:
            "Installs dreamy-ui, dreamy-ui-frontend, and dreamy-ui-theming skills teaching semantic tokens, JSX style props, and composition patterns.",
        href: "/docs/ai-agents/skills",
        badge: "Playbooks",
        icon: LuLayers,
        accent: "secondary" as const
    },
    {
        title: "Full llms.txt (/llms.txt)",
        description:
            "Single-URL documentation index formatted for Cursor @Docs, Windsurf rules, and custom context pipelines with zero scraping needed.",
        href: "/docs/ai-agents/llms",
        badge: "Context",
        icon: LuFileText,
        accent: "primary" as const
    }
];

const installedSkills = [
    {
        name: "dreamy-ui",
        summary: "Core library rules, MCP tool flow, and component discovery order."
    },
    {
        name: "dreamy-ui-frontend",
        summary: "JSX style props, semantic tokens, cva recipes, and fallback composition."
    },
    {
        name: "dreamy-ui-theming",
        summary: "Panda config setup, createDreamyPresets, colorTuning, and motion defaults."
    }
];

const agentSteps = [
    {
        step: "01",
        label: "list_components",
        trace: 'mcp -> list_components({ query: "button" })  [64 components indexed]'
    },
    {
        step: "02",
        label: "get_component",
        trace: 'mcp -> get_component({ id: "button" })  [variants, sizes, recipes loaded]'
    },
    {
        step: "03",
        label: "Typed JSX output",
        trace: 'tsx -> <Button variant="primary" size="lg">Ship</Button>  [type-safe JSX]'
    }
] as const;

const supportedClients = ["Cursor", "Claude Code", "VS Code Copilot", "Windsurf", "Codex", "Zed"];

export default function AiFirst() {
    const data = useLoaderData<Route.ComponentProps["loaderData"]>();
    const reduceMotion = useReducedMotion();
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (reduceMotion || isPaused) return;
        const intervalId = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % agentSteps.length);
        }, 2400);
        return () => clearInterval(intervalId);
    }, [reduceMotion, isPaused]);

    return (
        <Flex
            col
            full
            gap={10}
        >
            {/* Header */}
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
                    AI-First Architecture
                </Text>
                <Heading
                    color={"fg.max"}
                    letterSpacing={"tight"}
                    size={{ base: "3xl", md: "4xl" }}
                    textCenter
                >
                    Built for coding agents from day one
                </Heading>
                <Text
                    color={"fg.medium"}
                    lineHeight={"relaxed"}
                    maxW={"2xl"}
                    size={"lg"}
                    textCenter
                >
                    Stop fighting hallucinated prop names and broken CSS. Dreamy UI ships structured
                    component schemas, agent skills, and clean markdown docs so AI assistants
                    generate accurate interfaces on the first prompt.
                </Text>
            </Flex>

            {/* Two-column showcase */}
            <Grid
                alignItems={"stretch"}
                columns={{ base: 1, xl: 12 }}
                full
                gap={6}
            >
                {/* Left: 3 capability cards */}
                <Flex
                    col
                    gap={3}
                    gridColumn={{ base: "span 1", xl: "span 5" }}
                >
                    {capabilities.map((item, i) => {
                        const isSecondary = item.accent === "secondary";
                        return (
                            <m.div
                                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                                key={item.title}
                                style={{ flex: 1, display: "flex" }}
                                transition={{ duration: 0.35, delay: i * 0.08 }}
                                viewport={{ once: true }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                <Link
                                    _hover={{
                                        bg: "bg.panel",
                                        borderColor: isSecondary ? "secondary/40" : "primary/40"
                                    }}
                                    backdropBlur={"md"}
                                    backdropFilter={"auto"}
                                    bg={"bg.panel/60"}
                                    border={"1px solid"}
                                    borderColor={"border"}
                                    display={"flex"}
                                    flexDirection={"column"}
                                    gap={3}
                                    h={"full"}
                                    p={5}
                                    prefetch="intent"
                                    rounded={"xl"}
                                    to={item.href}
                                    transition={"background-color 0.2s, border-color 0.2s"}
                                    w={"full"}
                                >
                                    <HStack
                                        contentBetween
                                        w={"full"}
                                    >
                                        <HStack gap={3}>
                                            <Flex
                                                align={"center"}
                                                bg={isSecondary ? "secondary/10" : "primary/10"}
                                                boxSize={"9"}
                                                center
                                                rounded={"lg"}
                                                shrink={0}
                                            >
                                                <Icon
                                                    as={item.icon}
                                                    boxSize={"4.5"}
                                                    color={isSecondary ? "secondary" : "primary"}
                                                />
                                            </Flex>
                                            <Text
                                                color={"fg.max"}
                                                fontWeight={"semibold"}
                                                size={"md"}
                                            >
                                                {item.title}
                                            </Text>
                                        </HStack>

                                        <Icon
                                            as={LuArrowUpRight}
                                            boxSize={"4"}
                                            color={"fg.medium"}
                                        />
                                    </HStack>

                                    <Text
                                        color={"fg.medium"}
                                        lineHeight={"relaxed"}
                                        size={"sm"}
                                    >
                                        {item.description}
                                    </Text>

                                    <HStack mt={"auto"}>
                                        <Badge
                                            px={2}
                                            py={0.5}
                                            rounded={"full"}
                                            scheme={isSecondary ? "secondary" : "primary"}
                                            variant={"subtle"}
                                        >
                                            {item.badge}
                                        </Badge>
                                    </HStack>
                                </Link>
                            </m.div>
                        );
                    })}
                </Flex>

                {/* Right: Interactive AI setup & inspection tabs */}
                <Flex
                    backdropBlur={"md"}
                    backdropFilter={"auto"}
                    bg={"bg.panel/70"}
                    border={"1px solid"}
                    borderColor={"border"}
                    col
                    gap={5}
                    gridColumn={{ base: "span 1", xl: "span 7" }}
                    p={{ base: 5, md: 6 }}
                    rounded={"2xl"}
                >
                    <Tabs.Root
                        defaultValue="mcp"
                        size={"sm"}
                        variant={"filled"}
                    >
                        <HStack
                            contentBetween
                            flexWrap={"wrap"}
                            gap={3}
                            w={"full"}
                        >
                            <Tabs.List>
                                <Tabs.Tab value="mcp">MCP Server</Tabs.Tab>
                                <Tabs.Tab value="skills">Agent Skills</Tabs.Tab>
                                <Tabs.Tab value="llms">llms.txt</Tabs.Tab>
                            </Tabs.List>

                            <HStack gap={2}>
                                <Icon
                                    as={LuBot}
                                    boxSize={"4"}
                                    color={"primary"}
                                />
                                <Text
                                    color={"fg.medium"}
                                    fontFamily={"mono"}
                                    size={"xs"}
                                >
                                    Authoritative Agent Context
                                </Text>
                            </HStack>
                        </HStack>

                        <Tabs.Panels mt={4}>
                            {/* MCP Tab */}
                            <Tabs.Panel value="mcp">
                                <Flex
                                    col
                                    gap={4}
                                >
                                    <PmCommandSnippet commandSuffix="add-mcp" />

                                    <Flex
                                        bg={"bg"}
                                        border={"1px solid"}
                                        borderColor={"border"}
                                        col
                                        overflow={"hidden"}
                                        rounded={"xl"}
                                    >
                                        <HStack
                                            borderBottomWidth={"1px"}
                                            borderColor={"border"}
                                            contentBetween
                                            px={4}
                                            py={2.5}
                                        >
                                            <HStack gap={1.5}>
                                                <Box
                                                    bg={"alpha.200"}
                                                    boxSize={"2"}
                                                    rounded={"full"}
                                                />
                                                <Box
                                                    bg={"alpha.200"}
                                                    boxSize={"2"}
                                                    rounded={"full"}
                                                />
                                                <Box
                                                    bg={"alpha.200"}
                                                    boxSize={"2"}
                                                    rounded={"full"}
                                                />
                                            </HStack>
                                            <Text
                                                color={"fg.medium"}
                                                fontFamily={"mono"}
                                                size={"xs"}
                                            >
                                                .cursor/mcp.json
                                            </Text>
                                        </HStack>
                                        <Box
                                            fontSize={"sm"}
                                            overflow={"auto"}
                                            p={4}
                                        >
                                            {data.mcp && <MDXRemote {...data.mcp} />}
                                        </Box>
                                    </Flex>

                                    {/* Interactive live agent trace */}
                                    <Flex
                                        col
                                        gap={2.5}
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                    >
                                        <Grid
                                            columns={{ base: 1, sm: 3 }}
                                            gap={2.5}
                                        >
                                            {agentSteps.map((item, idx) => {
                                                const isActive = activeStep === idx;
                                                return (
                                                    <Button
                                                        _hover={{
                                                            bg: isActive
                                                                ? "primary/12"
                                                                : "bg.panel",
                                                            borderColor: isActive
                                                                ? "primary/50"
                                                                : "border.hover"
                                                        }}
                                                        aria-pressed={isActive}
                                                        bg={isActive ? "primary/08" : "bg/70"}
                                                        borderColor={
                                                            isActive ? "primary/50" : "border"
                                                        }
                                                        gap={2}
                                                        h={"auto"}
                                                        justifyContent={"space-between"}
                                                        key={item.step}
                                                        onClick={() => setActiveStep(idx)}
                                                        px={3}
                                                        py={2.5}
                                                        rounded={"lg"}
                                                        size={"sm"}
                                                        variant={"outline"}
                                                        w={"full"}
                                                    >
                                                        <HStack gap={2}>
                                                            <Text
                                                                color={"primary"}
                                                                fontFamily={"mono"}
                                                                fontWeight={"semibold"}
                                                                size={"xs"}
                                                            >
                                                                {item.step}
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    isActive ? "fg.max" : "fg"
                                                                }
                                                                fontFamily={"mono"}
                                                                size={"xs"}
                                                            >
                                                                {item.label}
                                                            </Text>
                                                        </HStack>

                                                        <Box
                                                            bg={
                                                                isActive
                                                                    ? "primary"
                                                                    : "alpha.200"
                                                            }
                                                            boxSize={"1.5"}
                                                            rounded={"full"}
                                                            transition={"background-color 0.2s"}
                                                        />
                                                    </Button>
                                                );
                                            })}
                                        </Grid>

                                        <Box
                                            bg={"bg"}
                                            border={"1px solid"}
                                            borderColor={"border"}
                                            overflow={"hidden"}
                                            px={3.5}
                                            py={2.5}
                                            rounded={"lg"}
                                        >
                                            <m.div
                                                animate={{ opacity: 1, y: 0 }}
                                                initial={
                                                    reduceMotion ? false : { opacity: 0, y: 4 }
                                                }
                                                key={activeStep}
                                                transition={{ duration: 0.22 }}
                                            >
                                                <HStack gap={2}>
                                                    <Box
                                                        bg={"primary"}
                                                        boxSize={"1.5"}
                                                        rounded={"full"}
                                                        shrink={0}
                                                    />
                                                    <Text
                                                        color={"fg.medium"}
                                                        fontFamily={"mono"}
                                                        overflow={"hidden"}
                                                        size={"xs"}
                                                        textOverflow={"ellipsis"}
                                                        whiteSpace={"nowrap"}
                                                    >
                                                        {agentSteps[activeStep].trace}
                                                    </Text>
                                                </HStack>
                                            </m.div>
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Tabs.Panel>

                            {/* Skills Tab */}
                            <Tabs.Panel value="skills">
                                <Flex
                                    col
                                    gap={4}
                                >
                                    <PmCommandSnippet commandSuffix="add-skill" />

                                    <Flex
                                        col
                                        gap={2.5}
                                    >
                                        {installedSkills.map((skill) => (
                                            <Flex
                                                bg={"bg/70"}
                                                border={"1px solid"}
                                                borderColor={"border"}
                                                col
                                                gap={1.5}
                                                key={skill.name}
                                                p={4}
                                                rounded={"xl"}
                                            >
                                                <HStack
                                                    contentBetween
                                                    w={"full"}
                                                >
                                                    <HStack gap={2}>
                                                        <Icon
                                                            as={LuTerminal}
                                                            boxSize={"3.5"}
                                                            color={"primary"}
                                                        />
                                                        <Text
                                                            color={"fg.max"}
                                                            fontFamily={"mono"}
                                                            fontWeight={"semibold"}
                                                            size={"sm"}
                                                        >
                                                            {skill.name}
                                                        </Text>
                                                    </HStack>
                                                    <Badge
                                                        px={2}
                                                        py={0.5}
                                                        rounded={"full"}
                                                        scheme={"primary"}
                                                        variant={"subtle"}
                                                    >
                                                        Skill
                                                    </Badge>
                                                </HStack>
                                                <Text
                                                    color={"fg.medium"}
                                                    size={"sm"}
                                                >
                                                    {skill.summary}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Tabs.Panel>

                            {/* llms.txt Tab */}
                            <Tabs.Panel value="llms">
                                <Flex
                                    col
                                    gap={4}
                                >
                                    <Snippet.Root w="full">
                                        <Snippet.Header aria-label="LLMs.txt URL">
                                            <Text
                                                color={"fg.medium"}
                                                fontFamily={"mono"}
                                                size={"xs"}
                                            >
                                                Documentation Endpoint
                                            </Text>
                                        </Snippet.Header>
                                        <Snippet.Body codeString="https://dreamy-ui.com/llms.txt">
                                            https://dreamy-ui.com/llms.txt
                                        </Snippet.Body>
                                    </Snippet.Root>

                                    <Grid
                                        columns={{ base: 1, sm: 2 }}
                                        gap={3}
                                    >
                                        <Flex
                                            bg={"bg/70"}
                                            border={"1px solid"}
                                            borderColor={"border"}
                                            col
                                            gap={1.5}
                                            p={4}
                                            rounded={"xl"}
                                        >
                                            <Text
                                                color={"fg.max"}
                                                fontWeight={"semibold"}
                                                size={"sm"}
                                            >
                                                Cursor @Docs
                                            </Text>
                                            <Text
                                                color={"fg.medium"}
                                                size={"sm"}
                                            >
                                                Paste the URL in Cursor custom docs and reference it
                                                directly with @Docs in any prompt.
                                            </Text>
                                        </Flex>

                                        <Flex
                                            bg={"bg/70"}
                                            border={"1px solid"}
                                            borderColor={"border"}
                                            col
                                            gap={1.5}
                                            p={4}
                                            rounded={"xl"}
                                        >
                                            <Text
                                                color={"fg.max"}
                                                fontWeight={"semibold"}
                                                size={"sm"}
                                            >
                                                Windsurf & Custom RAG
                                            </Text>
                                            <Text
                                                color={"fg.medium"}
                                                size={"sm"}
                                            >
                                                Feed the plain-text index into Windsurf rules, CLI
                                                workflows, or team knowledge bases.
                                            </Text>
                                        </Flex>
                                    </Grid>

                                    <HStack>
                                        <Button
                                            render={
                                                <a
                                                    href="/llms.txt"
                                                    rel="noreferrer"
                                                    target="_blank"
                                                />
                                            }
                                            rightIcon={<LuArrowUpRight />}
                                            size={"sm"}
                                            variant={"outline"}
                                        >
                                            Open /llms.txt
                                        </Button>
                                    </HStack>
                                </Flex>
                            </Tabs.Panel>
                        </Tabs.Panels>
                    </Tabs.Root>
                </Flex>
            </Grid>

            {/* Supported AI clients bar */}
            <HStack
                flexWrap={"wrap"}
                gap={2.5}
                justify={"center"}
            >
                <Text
                    color={"fg.medium"}
                    fontFamily={"mono"}
                    mr={1}
                    size={"xs"}
                >
                    Works out of the box with:
                </Text>
                {supportedClients.map((client) => (
                    <Box
                        bg={"bg.panel/70"}
                        border={"1px solid"}
                        borderColor={"border"}
                        color={"fg.medium"}
                        fontFamily={"mono"}
                        fontSize={"xs"}
                        key={client}
                        px={3}
                        py={1}
                        rounded={"full"}
                    >
                        {client}
                    </Box>
                ))}
            </HStack>
        </Flex>
    );
}
