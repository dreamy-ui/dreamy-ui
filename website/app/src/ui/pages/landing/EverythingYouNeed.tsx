import { Box, Flex, Grid, HStack, Heading, Icon, Text } from "@dreamy-ui/react/rsc";
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
        description: "Smooth animations for a better user experience"
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
                mt={20}
            >
                <Heading
                    size="4xl"
                    textCenter
                >
                    Everything you
                    <Box
                        as="span"
                        px={2}
                        py={0.5}
                        rounded={"sm"}
                        bg={"secondary/12"}
                        color={"secondary"}
                        ml={1}
                    >
                        need
                    </Box>
                </Heading>
                <Text
                    size={"2xl"}
                    color={"fg.medium"}
                    textCenter
                >
                    Featured component library for your app
                </Text>
            </Flex>

            <Grid
                columns={{
                    base: 1,
                    md: 3
                }}
                columnGap={{
                    base: 4,
                    md: 10
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
            col
            gap={2}
            px={6}
            py={4}
            rounded={"l2"}
            border={"1px solid"}
            borderColor={"border.muted"}
            bg={"alpha.50"}
        >
            <HStack>
                <Icon
                    as={icon}
                    // color={"secondary"}
                />
                <Text
                    fontWeight={"semibold"}
                    // color={"secondary"}
                >
                    {title}
                </Text>
            </HStack>
            <Text color={"fg.medium"}>{description}</Text>
        </Flex>
    );
}
