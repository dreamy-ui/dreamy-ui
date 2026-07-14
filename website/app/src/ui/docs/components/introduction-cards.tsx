import { Flex, Grid, Icon, Text } from "@/ui";
import type { ElementType } from "react";
import { useState } from "react";
import { BiSolidComponent } from "react-icons/bi";
import { HiColorSwatch } from "react-icons/hi";
import { LuBot, LuChevronRight, LuTerminal } from "react-icons/lu";
import { Link } from "~/src/ui/global/Link";

interface GuideCardItem {
    title: string;
    description: string;
    href: string;
    icon: ElementType;
    scheme: string;
}

const cards: GuideCardItem[] = [
    {
        title: "Installation",
        description: "Set up Dreamy UI in minutes with the CLI or follow the manual install guide.",
        href: "/docs/guide/installation",
        icon: LuTerminal,
        scheme: "success"
    },
    {
        title: "AI Agents",
        description:
            "Connect LLMs, MCP servers, and skills so your agents can build with Dreamy UI.",
        href: "/docs/ai-agents/llms",
        icon: LuBot,
        scheme: "primary"
    },
    {
        title: "Theming",
        description: "Customize tokens, recipes, and fonts to match your brand with Panda CSS.",
        href: "/docs/theming/customization",
        icon: HiColorSwatch,
        scheme: "info"
    },
    {
        title: "Components",
        description: "Browse 60+ accessible, production-ready components with live examples.",
        href: "/docs/components/accordion",
        icon: BiSolidComponent,
        scheme: "warning"
    }
];

export function IntroductionCards() {
    return (
        <Grid
            columnGap={4}
            columns={{ base: 1, md: 2 }}
            full
            my={6}
            rowGap={4}
        >
            {cards.map((card) => (
                <GuideCard
                    key={card.href}
                    {...card}
                />
            ))}
        </Grid>
    );
}

interface GuideCardProps extends GuideCardItem {}

function GuideCard({ title, description, href, icon, scheme }: GuideCardProps) {
    const [hovered, setHovered] = useState(false);
    const colorVar = `var(--colors-${scheme})`;

    return (
        <Link
            _hover={{ textDecoration: "none" }}
            display={"block"}
            h={"full"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            textDecoration={"none"}
            to={href}
        >
            <Flex
                backdropBlur={"md"}
                backdropFilter={"auto"}
                border={"1px solid"}
                col
                gap={4}
                h={"full"}
                px={6}
                py={5}
                rounded={"xl"}
                style={{
                    background: hovered
                        ? `color-mix(in srgb, ${colorVar} 6%, var(--colors-bg))`
                        : "color-mix(in srgb, var(--colors-bg) 50%, transparent)",
                    borderColor: hovered
                        ? `color-mix(in srgb, ${colorVar} 40%, transparent)`
                        : "var(--colors-border)",
                    transition: "background 0.2s, border-color 0.2s"
                }}
            >
                <Flex
                    align={"center"}
                    justify={"space-between"}
                >
                    <Flex
                        align={"center"}
                        boxSize={"10"}
                        center
                        rounded={"lg"}
                        style={{
                            background: `color-mix(in srgb, ${colorVar} 12%, transparent)`
                        }}
                    >
                        <Icon
                            as={icon}
                            boxSize={"5"}
                            color={scheme as "primary"}
                        />
                    </Flex>
                    <Icon
                        as={LuChevronRight}
                        boxSize={"4"}
                        color={"fg.disabled"}
                        style={{
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? "translateX(0)" : "translateX(-4px)",
                            transition: "opacity 0.2s, transform 0.2s"
                        }}
                    />
                </Flex>
                <Flex
                    col
                    gap={1.5}
                >
                    <Text
                        color={"fg"}
                        fontWeight={"semibold"}
                        size={"md"}
                    >
                        {title}
                    </Text>
                    <Text
                        color={"fg.medium"}
                        lineHeight={"tall"}
                        size={"sm"}
                    >
                        {description}
                    </Text>
                </Flex>
            </Flex>
        </Link>
    );
}
