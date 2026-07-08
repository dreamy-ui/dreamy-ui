import { Badge } from "@/ui";
import { Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { BsDiscord } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { MdOutlineCloud } from "react-icons/md";
import { Link } from "react-router";
import { PMTabs } from "~/src/ui/docs/components/pm-tabs";

export default function Main() {
    return (
        <Flex
            col
            gap={20}
            maxW={{ base: "full", lg: "2xl" }}
        >
            <Flex
                col
                gap={6}
            >
                <Badge
                    alignSelf={"flex-start"}
                    gap={2}
                    px={3}
                    py={1.5}
                    rounded={"full"}
                    scheme={"secondary"}
                    variant={"subtle"}
                >
                    <Box
                        as={MdOutlineCloud}
                        boxSize={"4"}
                    />
                    V2 is here with React Server Components support
                </Badge>

                <Flex
                    col
                    gap={3}
                >
                    <Heading
                        fontWeight={"bold"}
                        letterSpacing={"tight"}
                        lineHeight={"1.1"}
                        size={{
                            base: "5xl",
                            md: "7xl"
                        }}
                    >
                        Build interfaces{" "}
                        <Box
                            as={"span"}
                            gradientFrom={"primary"}
                            gradientTo={"secondary"}
                            textGradient={"to-br"}
                        >
                            that feel
                        </Box>
                        <br />
                        <Box
                            as={"span"}
                            gradientFrom={"secondary"}
                            gradientTo={"primary"}
                            textGradient={"to-r"}
                        >
                            ethereally good
                        </Box>
                    </Heading>

                    <Text
                        color="fg.medium"
                        maxW={"lg"}
                        size="lg"
                    >
                        A React component library built for those who care about craft. Accessible,
                        composable, and obsessively designed. Powered by Panda CSS.
                    </Text>
                </Flex>

                <HStack
                    gap={3}
                    wrapped
                >
                    <Button
                        as={
                            <Link
                                prefetch="intent"
                                to="/docs/guide/introduction"
                            />
                        }
                        px={6}
                        rightIcon={<IoArrowForward />}
                        size={"lg"}
                        variant={"primary"}
                    >
                        Get Started
                    </Button>
                    <Button
                        as={
                            <Link
                                target="_blank"
                                to="/discord"
                            />
                        }
                        leftIcon={<BsDiscord />}
                        px={6}
                        size={"lg"}
                        variant={"solid"}
                    >
                        Discord
                    </Button>
                </HStack>
            </Flex>

            <Flex
                col
                gap={6}
            >
                <PMTabs>
                    <PMTabs.Option name="npm">npx dreamy init</PMTabs.Option>
                    <PMTabs.Option name="pnpm">pnpm dlx dreamy init</PMTabs.Option>
                    <PMTabs.Option name="yarn">yarn dlx dreamy init</PMTabs.Option>
                    <PMTabs.Option name="bun">bun dlx dreamy init</PMTabs.Option>
                </PMTabs>

                <HStack
                    color={"fg.subtle"}
                    flexWrap={"wrap"}
                    gap={4}
                >
                    {["React 19+", "100% TypeScript", "React Server Components", "AI Ready"].map(
                        (t) => (
                            <HStack
                                gap={1.5}
                                key={t}
                            >
                                <Box
                                    bg={"primary"}
                                    boxSize={"1.5"}
                                    rounded={"full"}
                                />
                                <Text
                                    color={"fg.subtle"}
                                    fontFamily={"mono"}
                                    size={"sm"}
                                >
                                    {t}
                                </Text>
                            </HStack>
                        )
                    )}
                </HStack>
            </Flex>
        </Flex>
    );
}
