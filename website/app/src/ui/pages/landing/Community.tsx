import { Box, Button, Flex, Grid, Heading, HStack, Icon, Link, Text } from "@/ui";
import { m } from "motion/react";
import { BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { IoArrowForward } from "react-icons/io5";
import { LuComponent, LuGitPullRequest, LuStar } from "react-icons/lu";
import { MdOutlineBugReport } from "react-icons/md";
import { RiDiscordLine } from "react-icons/ri";
import { Link as RouterLink } from "react-router";

const communities = [
    {
        title: "Discord",
        href: "/discord",
        tagline: "Talk directly with builders.",
        description:
            "Ask questions, share what you are building, get unblocked quickly, and help shape upcoming Dreamy UI primitives and AI tooling.",
        icon: FaDiscord,
        accent: "primary" as const,
        cta: "Join the server",
        highlights: [
            { icon: RiDiscordLine, text: "Direct help from maintainers" },
            { icon: LuComponent, text: "Component proposals & feedback" },
            { icon: MdOutlineBugReport, text: "Early previews of upcoming releases" }
        ]
    },
    {
        title: "GitHub",
        href: `https://github.com/${import.meta.env.VITE_SOURCE_REPO}`,
        tagline: "Open source, open roadmap.",
        description:
            "Every component, recipe, and MCP server tool is open source. Inspect the implementation, report issues, or contribute pull requests.",
        icon: BsGithub,
        accent: "secondary" as const,
        cta: "View on GitHub",
        highlights: [
            { icon: LuStar, text: "Star the repository to support the project" },
            { icon: LuGitPullRequest, text: "Submit pull requests of any size" },
            { icon: MdOutlineBugReport, text: "File issues and track releases" }
        ]
    }
] satisfies CommunityCardProps[];

export default function Communities() {
    return (
        <Flex
            col
            full
            gap={20}
        >
            {/* Community cards */}
            <Flex
                col
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
                        Community
                    </Text>
                    <Heading
                        color={"fg.max"}
                        letterSpacing={"tight"}
                        size={{ base: "3xl", md: "4xl" }}
                        textCenter
                    >
                        Built in the open
                    </Heading>
                    <Text
                        color={"fg.medium"}
                        lineHeight={"relaxed"}
                        maxW={"xl"}
                        size={"lg"}
                        textCenter
                    >
                        Ask questions, propose new components, or contribute directly to the
                        registry and MCP ecosystem.
                    </Text>
                </Flex>

                <Grid
                    columns={{ base: 1, md: 2 }}
                    full
                    gap={5}
                >
                    {communities.map((community, i) => (
                        <m.div
                            initial={{ opacity: 0, y: 16 }}
                            key={community.title}
                            style={{ height: "100%" }}
                            transition={{ duration: 0.35, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <CommunityCard {...community} />
                        </m.div>
                    ))}
                </Grid>
            </Flex>

            {/* Final CTA banner */}
            <Flex
                backdropBlur={"lg"}
                backdropFilter={"auto"}
                bg={"bg.panel/70"}
                border={"1px solid"}
                borderColor={"border"}
                col
                full
                gap={0}
                itemsCenter
                overflow={"hidden"}
                pos={"relative"}
                px={{ base: 6, md: 16 }}
                py={{ base: 12, md: 18 }}
                rounded={"2xl"}
                textCenter
            >
                {/* Ambient brand glows strictly using primary and secondary */}
                <Box
                    bg={"primary"}
                    blur={"90px"}
                    filter={"auto"}
                    h={"280px"}
                    left={"50%"}
                    opacity={0.1}
                    pos={"absolute"}
                    rounded={"full"}
                    style={{ transform: "translateX(-50%)" }}
                    top={"-110px"}
                    w={"420px"}
                />
                <Box
                    bg={"secondary"}
                    blur={"70px"}
                    bottom={"-80px"}
                    filter={"auto"}
                    h={"200px"}
                    left={"28%"}
                    opacity={0.07}
                    pos={"absolute"}
                    rounded={"full"}
                    w={"320px"}
                />

                <Flex
                    center
                    col
                    gap={6}
                    maxW={"2xl"}
                    pos={"relative"}
                >
                    <Flex
                        col
                        gap={3}
                    >
                        <Text
                            color={"primary"}
                            fontFamily={"mono"}
                            fontWeight={"semibold"}
                            letterSpacing={"widest"}
                            size={"xs"}
                            textTransform={"uppercase"}
                        >
                            Get Started
                        </Text>
                        <Heading
                            color={"fg.max"}
                            letterSpacing={"tight"}
                            lineHeight={"1.1"}
                            size={{ base: "3xl", md: "5xl" }}
                        >
                            Ready to build something{" "}
                            <Box
                                as={"span"}
                                gradientFrom={"primary"}
                                gradientTo={"secondary"}
                                textGradient={"to-r"}
                            >
                                dreamy?
                            </Box>
                        </Heading>
                    </Flex>
                    <Text
                        color={"fg.medium"}
                        lineHeight={"relaxed"}
                        maxW={"lg"}
                        size={"lg"}
                        textCenter
                    >
                        Initialize Dreamy UI in seconds, connect the MCP server to your coding
                        agent, and ship accessible React interfaces you completely own.
                    </Text>
                    <HStack
                        gap={3}
                        justify={"center"}
                        wrapped
                    >
                        <Button
                            px={7}
                            render={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/guide/introduction"
                                />
                            }
                            rightIcon={<IoArrowForward />}
                            size={"lg"}
                            variant={"primary"}
                        >
                            Start Building
                        </Button>
                        <Button
                            px={7}
                            render={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/components/accordion"
                                />
                            }
                            rightIcon={<LuComponent />}
                            size={"lg"}
                            variant={"outline"}
                        >
                            Browse Components
                        </Button>
                    </HStack>
                </Flex>
            </Flex>
        </Flex>
    );
}

interface CommunityCardProps {
    title: string;
    href: string;
    tagline: string;
    description: string;
    icon: React.ElementType;
    accent: "primary" | "secondary";
    cta: string;
    highlights: { icon: React.ElementType; text: string }[];
}

function CommunityCard({
    title,
    href,
    tagline,
    description,
    icon,
    accent,
    cta,
    highlights
}: CommunityCardProps) {
    const isSecondary = accent === "secondary";

    return (
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
            col
            display={"flex"}
            gap={6}
            h={"full"}
            href={href}
            isExternal
            px={8}
            py={7}
            rounded={"2xl"}
            transition={"background-color 0.2s, border-color 0.2s"}
        >
            {/* Header */}
            <HStack gap={4}>
                <Flex
                    align={"center"}
                    bg={isSecondary ? "secondary/10" : "primary/10"}
                    boxSize={"14"}
                    center
                    rounded={"xl"}
                    shrink={"0"}
                >
                    <Icon
                        as={icon}
                        boxSize={"7"}
                        color={isSecondary ? "secondary" : "primary"}
                    />
                </Flex>
                <Flex
                    col
                    gap={1}
                >
                    <Text
                        color={"fg.max"}
                        fontWeight={"bold"}
                        size={"xl"}
                    >
                        {title}
                    </Text>
                    <Text
                        color={isSecondary ? "secondary" : "primary"}
                        fontFamily={"mono"}
                        size={"sm"}
                    >
                        {tagline}
                    </Text>
                </Flex>
            </HStack>

            {/* Description */}
            <Text
                color={"fg.medium"}
                lineHeight={"relaxed"}
                size={"sm"}
            >
                {description}
            </Text>

            {/* Highlights */}
            <Flex
                col
                gap={3}
            >
                {highlights.map((h) => (
                    <HStack
                        gap={3}
                        key={h.text}
                    >
                        <Flex
                            align={"center"}
                            bg={isSecondary ? "secondary/10" : "primary/10"}
                            boxSize={"7"}
                            center
                            rounded={"md"}
                            shrink={"0"}
                        >
                            <Icon
                                as={h.icon}
                                boxSize={"3.5"}
                                color={isSecondary ? "secondary" : "primary"}
                            />
                        </Flex>
                        <Text
                            color={"fg.medium"}
                            size={"sm"}
                        >
                            {h.text}
                        </Text>
                    </HStack>
                ))}
            </Flex>

            {/* CTA row */}
            <HStack
                color={isSecondary ? "secondary" : "primary"}
                gap={1.5}
                mt={"auto"}
            >
                <Text
                    color={isSecondary ? "secondary" : "primary"}
                    fontWeight={"semibold"}
                    size={"sm"}
                >
                    {cta}
                </Text>
                <Icon
                    as={FiExternalLink}
                    boxSize={"3.5"}
                />
            </HStack>
        </Link>
    );
}
