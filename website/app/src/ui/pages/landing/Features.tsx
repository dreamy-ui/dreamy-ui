import { Box } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Link } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { BiLogoTypescript } from "react-icons/bi";
import { FaBorderStyle } from "react-icons/fa";
import { LuPaintbrushVertical } from "react-icons/lu";
import { useLoaderData } from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/_index";

const features = [
    {
        title: (
            <Heading size="4xl">
                Built on top of{" "}
                <Link
                    _hover={{
                        color: {
                            base: "#facc15",
                            _dark: "#fde047"
                        }
                    }}
                    bg={{
                        base: "#facc15/08",
                        _dark: "#fde047/12"
                    }}
                    color={{
                        base: "#facc15",
                        _dark: "#fde047"
                    }}
                    href="https://panda-css.com"
                    px={2}
                    py={0.5}
                    rounded={"sm"}
                    target="_blank"
                >
                    Panda CSS
                </Link>
            </Heading>
        ),
        description:
            "Panda CSS is a powerful, flexible CSS-in-JS library that allows to build performant, build-time styles using style props.",
        mdx: "panda",
        content: (
            <Flex
                col
                gap={4}
                justify={"center"}
                mt={4}
            >
                {[
                    {
                        text: "Recipes.",
                        icon: LuPaintbrushVertical,
                        description: "Generates css for only what you use."
                    },
                    {
                        text: "No runtime styles.",
                        icon: FaBorderStyle,
                        description: "Styles are generated at build time."
                    },
                    {
                        text: "CSS-in-JS.",
                        icon: BiLogoTypescript,
                        description: "Amazing DX, while keeping the best performance."
                    }
                ].map((item, i) => (
                    <HStack key={`feature-${i}`}>
                        <Icon
                            as={item.icon}
                            boxSize={"5"}
                        />
                        <Text fontWeight={"medium"}>
                            {item.text}{" "}
                            <Box
                                as={"span"}
                                color={"fg.medium"}
                                fontWeight={"normal"}
                            >
                                {item.description}
                            </Box>
                        </Text>
                    </HStack>
                ))}
            </Flex>
        )
    }
];

export default function Features() {
    return (
        <Flex
            col
            full
            gap={20}
        >
            {features.map((feature, i) => (
                <Feature
                    {...feature}
                    key={`feature-${i}`}
                />
            ))}
        </Flex>
    );
}

interface FeatureProps {
    title: React.ReactNode;
    description: string;
    mdx: string | null;
    content: React.ReactNode | null;
}

function Feature({ title, description, mdx, content }: FeatureProps) {
    const data = useLoaderData<Route.ComponentProps["loaderData"]>();

    return (
        <Flex
            align={{
                base: "start",
                xl: "center"
            }}
            direction={{
                base: "column",
                xl: "row"
            }}
            full
            gap={{
                base: 6,
                xl: 16
            }}
        >
            <Flex
                col
                gap={4}
                maxW={{
                    base: "full",
                    md: "xl"
                }}
            >
                <Flex
                    col
                    full
                    gap={4}
                >
                    {title}
                    <Text
                        color={"fg.medium"}
                        size="lg"
                    >
                        {description}
                    </Text>
                </Flex>
                {content && (
                    <Flex
                        col
                        full
                    >
                        {content}
                    </Flex>
                )}
            </Flex>

            {mdx && (
                <Flex
                    col
                    full
                >
                    <MDXRemote
                        // @ts-expect-error
                        {...(data[mdx] as MDXRemoteSerializeResult<any, any>)}
                    />
                </Flex>
            )}
        </Flex>
    );
}
