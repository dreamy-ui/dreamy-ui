import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Text } from "@/ui";
import { m } from "motion/react";
import { useState } from "react";
import { BiSolidComponent } from "react-icons/bi";
import { CgDarkMode } from "react-icons/cg";
import { LuBrainCircuit, LuParentheses, LuShield, LuTerminal, LuZap } from "react-icons/lu";
import { MdAnimation, MdOutlineDashboardCustomize, MdOutlineStyle } from "react-icons/md";

const features = [
    {
        title: "60+ Components",
        icon: BiSolidComponent,
        description:
            "A wide range of production-ready components, from simple Buttons to complex DatePickers and Autocomplete inputs.",
        scheme: "primary"
    },
    {
        title: "Lightning fast",
        icon: LuZap,
        description:
            "Tree-shakable, zero runtime CSS. Panda CSS generates only the styles your components actually use and ships minimal bytes.",
        scheme: "warning"
    },
    {
        title: "Deep customization",
        icon: MdOutlineDashboardCustomize,
        description:
            "One design-token API controls your entire palette. Override any component variant with a simple recipe extension.",
        scheme: "info"
    },
    {
        title: "Accessible by default",
        icon: LuShield,
        description:
            "Every component is WCAG 2.1 AA compliant. Keyboard navigation, ARIA attributes, and focus management are all handled out of the box.",
        scheme: "success"
    },
    {
        title: "Seamless dark mode",
        icon: CgDarkMode,
        description:
            "Dark mode ships as a first-class citizen. Switch modes with a single hook function, no extra CSS overrides needed.",
        scheme: "secondary"
    },
    {
        title: "Buttery animations",
        icon: MdAnimation,
        description:
            "Entrance and exit animations powered by Motion. Disable globally with a single prop for accessibility-first workflows.",
        scheme: "error"
    },
    {
        title: "AI Ready",
        icon: LuBrainCircuit,
        description:
            "Dreamy UI is built for the AI era. Components, hooks, and APIs are designed for seamless integration into AI-driven apps, with robust type safety that scales with your agents and automations.",
        scheme: "primary"
    },
    {
        title: "Useful hooks",
        icon: LuParentheses,
        description:
            "Control your UI with useful hooks like useControllable, useClipboard, useIsMobile, and more. Those are really awesome hooks, even your AI agent will use them.",
        scheme: "info"
    },
    {
        title: "One-command setup",
        icon: LuTerminal,
        description:
            "Run npx create-dreamy-app and you're live. Supports Next.js, Vite, React Router and Remix out of the box with no manual config required.",
        scheme: "success"
    }
];

export default function EverythingYouNeed() {
    return (
        <Flex
            col
            full
            gap={12}
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
                    Why Dreamy UI
                </Text>
                <Heading
                    size="4xl"
                    textCenter
                >
                    Everything you{" "}
                    <Box
                        as="span"
                        bg={"info/10"}
                        color={"info"}
                        px={2}
                        py={0.5}
                        rounded={"md"}
                    >
                        need
                    </Box>
                </Heading>
                <Text
                    color={"fg.medium"}
                    maxW={"xl"}
                    size={"lg"}
                    textCenter
                >
                    Every API decision, every animation, every token was made with intention.
                    Because the tools you use shape the things you build.
                </Text>
            </Flex>

            <Grid
                columnGap={{ base: 4, md: 6 }}
                columns={{ base: 1, md: 2, lg: 3 }}
                full
                rowGap={4}
            >
                {features.map((feature, i) => (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        key={feature.title}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <FeatureCard {...feature} />
                    </m.div>
                ))}
            </Grid>
        </Flex>
    );
}

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    scheme: string;
}

function FeatureCard({ title, description, icon, scheme }: FeatureCardProps) {
    const [hovered, setHovered] = useState(false);
    const colorVar = `var(--colors-${scheme})`;

    return (
        <Flex
            backdropBlur={"md"}
            backdropFilter={"auto"}
            border={"1px solid"}
            col
            gap={4}
            h={"full"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                    color={scheme as any}
                />
            </Flex>
            <Flex
                col
                gap={1.5}
            >
                <Text
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
    );
}
