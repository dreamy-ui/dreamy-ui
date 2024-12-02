import { Box, Flex, HStack, Heading, Icon, Link, Text } from "@dreamy-ui/react/rsc";
import { useLoaderData } from "@remix-run/react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { BiLogoTypescript } from "react-icons/bi";
import { FaBorderStyle } from "react-icons/fa";
import { LuPaintbrush2 } from "react-icons/lu";
import type { loader } from "~/routes/_index";

const features = [
    {
        title: (
            <Heading size="4xl">
                Built on top of{" "}
                <Link
                    href="https://panda-css.com"
                    target="_blank"
                    color={{
                        base: "#facc15",
                        _dark: "#fde047"
                    }}
                    px={2}
                    py={0.5}
                    rounded={"sm"}
                    bg={{
                        base: "#facc15/08",
                        _dark: "#fde047/12"
                    }}
                    _hover={{
                        color: {
                            base: "#facc15",
                            _dark: "#fde047"
                        }
                    }}
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
                justify={"center"}
                gap={4}
                mt={4}
                col
            >
                {[
                    {
                        text: "Recipes.",
                        icon: LuPaintbrush2,
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
            wFull
            col
            gap={20}
            mt={10}
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
    const data = useLoaderData<typeof loader>();

    return (
        <Flex
            wFull
            direction={{
                base: "column",
                xl: "row"
            }}
            align={{
                base: "start",
                xl: "center"
            }}
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
                    wFull
                    gap={4}
                >
                    {title}
                    <Text
                        size="lg"
                        color={"fg.medium"}
                    >
                        {description}
                    </Text>
                </Flex>
                {content && (
                    <Flex
                        wFull
                        col
                    >
                        {content}
                    </Flex>
                )}
            </Flex>

            {mdx && (
                <Flex
                    wFull
                    col
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
