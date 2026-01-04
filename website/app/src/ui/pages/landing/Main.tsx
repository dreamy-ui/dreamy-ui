import { Box } from "@/ui";
import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { BsDiscord } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { MdOutlineCloud } from "react-icons/md";
import { Link } from "react-router";

export default function Main() {
    return (
        <Flex
            col
            full
            gap={5}
            pos={"relative"}
            // pt={10}
        >
            <Flex
                bg={"secondary/18"}
                color={"secondary"}
                fontWeight={"semibold"}
                gap={3}
                itemsCenter
                px={4}
                py={2}
                rounded={"lg"}
                w={"fit-content"}
            >
                <Icon as={MdOutlineCloud} />
                V2 has been released!
            </Flex>

            <Heading
                fontWeight={"bold"}
                size={{
                    base: "4xl",
                    md: "6xl"
                }}
            >
                Create{" "}
                <Box
                    as={"span"}
                    gradientFrom={"primary"}
                    gradientTo={"tertiary"}
                    gradientVia={"secondary"}
                    textGradient={"to-r"}
                >
                    dream
                </Box>{" "}
                websites with <br /> <Box as={"span"}>next-gen DX</Box> and{" "}
                <Box
                    as={"span"}
                    gradientFrom={"tertiary"}
                    gradientTo={"primary"}
                    gradientVia={"secondary"}
                    textGradient={"to-r"}
                >
                    crispy
                </Box>{" "}
                UI
            </Heading>

            <Text
                color="fg.medium"
                size="lg"
            >
                Build performant, accessible, and beautiful websites with ease.
            </Text>

            <HStack mt={5}>
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
                    px={6}
                    rightIcon={<BsDiscord />}
                    size={"lg"}
                    variant={"solid"}
                >
                    Discord
                </Button>
            </HStack>
        </Flex>
    );
}
