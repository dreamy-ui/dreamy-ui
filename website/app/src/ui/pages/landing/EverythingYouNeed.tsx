import { Flex, Grid, Heading, Icon, Text } from "@/ui";
import { m } from "motion/react";
import { BiSolidComponent } from "react-icons/bi";
import { LuShield, LuTerminal, LuZap } from "react-icons/lu";
import { MdAnimation, MdOutlineDashboardCustomize } from "react-icons/md";

const features = [
    {
        title: "60+ Composable Components",
        icon: BiSolidComponent,
        description:
            "Modular primitives from Buttons and Badges to DatePickers, Steppers, and Autocomplete inputs."
    },
    {
        title: "Zero-Runtime Styling",
        icon: LuZap,
        description:
            "Panda CSS extracts static atomic CSS at build time, keeping bundles lean and React Server Components fast."
    },
    {
        title: "One Semantic Token API",
        icon: MdOutlineDashboardCustomize,
        description:
            "Configure brand colors, dark mode, typography, and radii once in createDreamyPresets to update every surface."
    },
    {
        title: "WCAG Accessible by Default",
        icon: LuShield,
        description:
            "Keyboard navigation, focus management, and semantic ARIA attributes are engineered into every component."
    },
    {
        title: "Motion Micro-Interactions",
        icon: MdAnimation,
        description:
            "Fluid enter, exit, and layout transitions powered by Motion with global reduced-motion support."
    },
    {
        title: "Full Code Ownership",
        icon: LuTerminal,
        description:
            "Install clean, readable components and recipes directly into your codebase with the Dreamy CLI."
    }
];

export default function EverythingYouNeed() {
    return (
        <Flex
            col
            full
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
                    Core Architecture
                </Text>
                <Heading
                    color={"fg.max"}
                    letterSpacing={"tight"}
                    size={{ base: "3xl", md: "4xl" }}
                    textCenter
                >
                    Everything you need to ship
                </Heading>
                <Text
                    color={"fg.medium"}
                    lineHeight={"relaxed"}
                    maxW={"xl"}
                    size={"lg"}
                    textCenter
                >
                    Every token, recipe, and primitive is engineered for speed, clarity, and
                    long-term maintainability.
                </Text>
            </Flex>

            <Grid
                columns={{ base: 1, md: 2, lg: 3 }}
                full
                gap={4}
            >
                {features.map((feature, i) => (
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        key={feature.title}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <Flex
                            _hover={{
                                bg: "bg.panel",
                                borderColor: "primary/40"
                            }}
                            backdropBlur={"md"}
                            backdropFilter={"auto"}
                            bg={"bg.panel/60"}
                            border={"1px solid"}
                            borderColor={"border"}
                            col
                            gap={4}
                            h={"full"}
                            p={6}
                            rounded={"xl"}
                            transition={"background-color 0.2s, border-color 0.2s"}
                        >
                            <Flex
                                align={"center"}
                                bg={"primary/10"}
                                boxSize={"10"}
                                center
                                rounded={"lg"}
                            >
                                <Icon
                                    as={feature.icon}
                                    boxSize={"5"}
                                    color={"primary"}
                                />
                            </Flex>
                            <Flex
                                col
                                gap={1.5}
                            >
                                <Text
                                    color={"fg.max"}
                                    fontWeight={"semibold"}
                                    size={"md"}
                                >
                                    {feature.title}
                                </Text>
                                <Text
                                    color={"fg.medium"}
                                    lineHeight={"relaxed"}
                                    size={"sm"}
                                >
                                    {feature.description}
                                </Text>
                            </Flex>
                        </Flex>
                    </m.div>
                ))}
            </Grid>
        </Flex>
    );
}
