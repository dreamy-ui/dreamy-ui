import { Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Link } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { m } from "motion/react";
import { useState } from "react";
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
        tagline: "Talk to builders, not bots.",
        description:
            "Our Discord is where the real conversations happen. Ask questions, share what you've built, get unblocked fast, and shape the future of Dreamy UI alongside the core team.",
        icon: FaDiscord,
        scheme: "primary",
        cta: "Join the server",
        highlights: [
            { icon: RiDiscordLine, text: "Real-time help from maintainers" },
            { icon: LuComponent, text: "Component feedback & proposals" },
            { icon: MdOutlineBugReport, text: "Sneak peeks at coming features" }
        ]
    },
    {
        title: "GitHub",
        href: `https://github.com/${import.meta.env.VITE_SOURCE_REPO}`,
        tagline: "Open source, open arms.",
        description:
            "Every line of Dreamy UI is open source. Browse the code, file issues, send PRs, and help steer the roadmap. Contributions of any size are welcome and celebrated.",
        icon: BsGithub,
        scheme: "secondary",
        cta: "View on GitHub",
        highlights: [
            { icon: LuStar, text: "Star the repo to show support" },
            { icon: LuGitPullRequest, text: "Submit PRs, all skills welcome" },
            { icon: MdOutlineBugReport, text: "File issues and track bugs" }
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
            {/* CTA */}
            <Flex
                backdropBlur={"lg"}
                backdropFilter={"auto"}
                bg={"bg/60"}
                border={"1px solid"}
                borderColor={"border"}
                col
                full
                gap={0}
                itemsCenter
                overflow={"hidden"}
                pos={"relative"}
                px={{ base: 8, md: 16 }}
                py={{ base: 12, md: 20 }}
                rounded={"2xl"}
                textCenter
            >
                {/* Glow orbs */}
                <Box
                    bg={"primary"}
                    blur={"80px"}
                    filter={"auto"}
                    h={"300px"}
                    left={"50%"}
                    opacity={0.12}
                    pos={"absolute"}
                    rounded={"full"}
                    style={{ transform: "translateX(-50%)" }}
                    top={"-100px"}
                    w={"400px"}
                />
                <Box
                    bg={"secondary"}
                    blur={"60px"}
                    bottom={"-60px"}
                    filter={"auto"}
                    h={"200px"}
                    left={"30%"}
                    opacity={0.08}
                    pos={"absolute"}
                    rounded={"full"}
                    w={"300px"}
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
                            Get started
                        </Text>
                        <Heading
                            letterSpacing={"tight"}
                            lineHeight={"1.1"}
                            size={"5xl"}
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
                        maxW={"lg"}
                        size={"lg"}
                        textCenter
                    >
                        Join developers shipping delightful products with Dreamy UI. Start in
                        minutes, scale without limits.
                    </Text>
                    <HStack
                        gap={3}
                        justify={"center"}
                        wrapped
                    >
                        <Button
                            as={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/guide/introduction"
                                />
                            }
                            px={7}
                            rightIcon={<IoArrowForward />}
                            size={"lg"}
                            variant={"primary"}
                        >
                            Start Building
                        </Button>
                        <Button
                            as={
                                <RouterLink
                                    prefetch="intent"
                                    to="/docs/components/accordion"
                                />
                            }
                            px={7}
                            rightIcon={<LuComponent />}
                            size={"lg"}
                            variant={"outline"}
                        >
                            Browse Components
                        </Button>
                    </HStack>
                </Flex>
            </Flex>

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
                        size="4xl"
                        textCenter
                    >
                        You&apos;re not building{" "}
                        <Box
                            as={"span"}
                            bg={"primary/10"}
                            color={"primary"}
                            px={2}
                            py={0.5}
                            rounded={"md"}
                        >
                            alone
                        </Box>
                    </Heading>
                    <Text
                        color={"fg.medium"}
                        maxW={"xl"}
                        size={"lg"}
                        textCenter
                    >
                        Dreamy UI is built in public, with and for the people who use it. Come hang
                        out, contribute, or just lurk. All are welcome.
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
                            transition={{ duration: 0.4, delay: i * 0.12 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <CommunityCard {...community} />
                        </m.div>
                    ))}
                </Grid>
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
    scheme: string;
    cta: string;
    highlights: { icon: React.ElementType; text: string }[];
}

function CommunityCard({
    title,
    href,
    tagline,
    description,
    icon,
    scheme,
    cta,
    highlights
}: CommunityCardProps) {
    const [hovered, setHovered] = useState(false);
    const colorVar = `var(--colors-${scheme})`;

    return (
        <Link
            backdropBlur={"md"}
            backdropFilter={"auto"}
            col
            display={"flex"}
            gap={6}
            h={"full"}
            href={href}
            isExternal
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            px={8}
            py={7}
            rounded={"2xl"}
            style={{
                background: hovered
                    ? `color-mix(in srgb, ${colorVar} 5%, var(--colors-bg))`
                    : "color-mix(in srgb, var(--colors-bg) 50%, transparent)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: hovered
                    ? `color-mix(in srgb, ${colorVar} 40%, transparent)`
                    : "var(--colors-border)",
                transition: "background 0.25s, border-color 0.25s"
            }}
        >
            {/* Header */}
            <HStack gap={4}>
                <Flex
                    align={"center"}
                    boxSize={"14"}
                    center
                    rounded={"xl"}
                    shrink={"0"}
                    style={{
                        background: `color-mix(in srgb, ${colorVar} 12%, transparent)`
                    }}
                >
                    <Icon
                        as={icon}
                        boxSize={"7"}
                        color={scheme as any}
                    />
                </Flex>
                <Flex
                    col
                    gap={1}
                >
                    <Text
                        fontWeight={"bold"}
                        size={"xl"}
                    >
                        {title}
                    </Text>
                    <Text
                        color={scheme as any}
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
                            boxSize={"7"}
                            center
                            rounded={"md"}
                            shrink={"0"}
                            style={{
                                background: `color-mix(in srgb, ${colorVar} 10%, transparent)`
                            }}
                        >
                            <Icon
                                as={h.icon}
                                boxSize={"3.5"}
                                color={scheme as any}
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
                color={scheme as any}
                gap={1.5}
                mt={"auto"}
            >
                <Text
                    color={scheme as any}
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
