import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { BiSolidComponent } from "react-icons/bi";
import { CgDarkMode } from "react-icons/cg";
import { MdAnimation, MdOutlineDashboardCustomize, MdOutlineStyle } from "react-icons/md";
import { TbServer } from "react-icons/tb";

const features = [
    {
        title: "Components",
        icon: BiSolidComponent,
        description: "A wide range of components to choose from"
    },
    {
        title: "Customization",
        icon: MdOutlineDashboardCustomize,
        description: "Customize components to your liking"
    },
    {
        title: "Easy dark mode",
        icon: CgDarkMode,
        description: "Dark mode is supported out of the box"
    },
    {
        title: "React server components",
        icon: TbServer,
        description: "Components compatible with RSC"
    },
    {
        title: "Smooth animations",
        icon: MdAnimation,
        description: "Beautiful smooth animations"
    },
    {
        title: "No runtime styles",
        icon: MdOutlineStyle,
        description: "Styles are generated at build time"
    }
];

export default function EverythingYouNeed() {
    return (
        <Flex
            col
            gap={10}
        >
            <Flex
                col
                gap={2}
            >
                <Heading
                    size="4xl"
                    textCenter
                >
                    Everything you
                    <Box
                        as="span"
                        bg={"info/12"}
                        color={"info"}
                        ml={1}
                        px={2}
                        py={0.5}
                        rounded={"sm"}
                    >
                        need
                    </Box>
                </Heading>
                <Text
                    color={"fg.medium"}
                    size={"2xl"}
                    textCenter
                >
                    Featured component library for your app
                </Text>
            </Flex>

            <Grid
                columnGap={{
                    base: 4,
                    md: 10
                }}
                columns={{
                    base: 1,
                    md: 3
                }}
                rowGap={4}
            >
                {features.map((feature, i) => (
                    <Feature
                        {...feature}
                        key={i}
                    />
                ))}
            </Grid>
        </Flex>
    );
}

interface FeatureProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

function Feature({ title, description, icon }: FeatureProps) {
    return (
        <Flex
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            bg={"bg/70"}
            border={"1px solid"}
            borderColor={"border"}
            col
            gap={2}
            px={6}
            py={4}
            rounded={"l2"}
        >
            <HStack>
                <Icon
                    as={icon}
                    color={"info"}
                />
                <Text
                    color={"info"}
                    fontWeight={"semibold"}
                >
                    {title}
                </Text>
            </HStack>
            <Text color={"fg.medium"}>{description}</Text>
        </Flex>
    );
}
