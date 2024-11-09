import { Button } from "@dreamy-ui/react";
import { Box, Flex, HStack, Heading, Icon, Text } from "@dreamy-ui/react/rsc";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { BsDiscord } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { MdOutlineCloud } from "react-icons/md";
import { CACHE_DURATION, CacheHeaders } from "~/src/.server/cache";

export const meta: MetaFunction = () => {
    return [{ title: "Dreamy UI - Build performant, websites with ease!" }];
};

export const headers = CacheHeaders.cache(CACHE_DURATION.DEFAULT);

export default function Index() {
    return (
        <>
            <Flex
                gap={5}
                py={{
                    base: 0,
                    md: 16
                }}
                col
                wFull
                pos={"relative"}
                minH={"calc(100vh - 32rem)"}
            >
                <Flex
                    py={2}
                    px={4}
                    rounded={"lg"}
                    bg={"secondary/18"}
                    w={"fit-content"}
                    color={"secondary"}
                    fontWeight={"semibold"}
                    gap={3}
                    itemsCenter
                >
                    <Icon as={MdOutlineCloud} />
                    This is a dream!
                </Flex>

                <Heading
                    size={{
                        base: "3xl",
                        md: "6xl"
                    }}
                    fontWeight={"bold"}
                >
                    Create{" "}
                    <Box
                        as={"span"}
                        textGradient={"to-r"}
                        gradientFrom={"primary"}
                        gradientVia={"secondary"}
                        gradientTo={"tertiary"}
                    >
                        dream
                    </Box>{" "}
                    websites with <br />{" "}
                    <Box
                        as={"span"}
                        // bgGradient={"to-r"}
                        // gradientFrom={"primary/33"}
                        // gradientTo={"secondary/33"}
                        // px={2}
                        // rounded={"sm"}
                    >
                        next-gen DX
                    </Box>{" "}
                    and{" "}
                    <Box
                        as={"span"}
                        textGradient={"to-r"}
                        gradientFrom={"tertiary"}
                        gradientVia={"secondary"}
                        gradientTo={"primary"}
                    >
                        crispy
                    </Box>{" "}
                    UI
                </Heading>

                <Text size="lg">Build performant, accessible, websites with ease.</Text>

                <HStack mt={5}>
                    <Button
                        variant={"primary"}
                        size={"lg"}
                        asComp={
                            <Link
                                to="/docs/guide/introduction"
                                prefetch="render"
                            />
                        }
                        rightIcon={<IoArrowForward />}
                        px={6}
                    >
                        Get Started
                    </Button>
                    <Button
                        px={6}
                        variant={"solid"}
                        size={"lg"}
                        asComp={
                            <Link
                                to="/discord"
                                target="_blank"
                            />
                        }
                        rightIcon={<BsDiscord />}
                    >
                        Discord
                    </Button>
                </HStack>
            </Flex>

            <Flex
                col
                center
                wFull
            ></Flex>
        </>
    );
}
