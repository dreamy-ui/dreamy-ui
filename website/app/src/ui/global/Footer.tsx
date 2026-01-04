import { Flex } from "@/ui";
import { Image } from "@/ui";
import { HStack } from "@/ui";
import { Text } from "@/ui";
import { Link } from "./Link";

export default function Footer() {
    return (
        <Flex
            align="center"
            as="footer"
            bg="bg.panel/30"
            borderColor="border!"
            borderTop="1px solid"
            direction="column"
            gap={6}
            mt={{
                base: 20,
                md: 40
            }}
            px={4}
            py={8}
        >
            <Link to="/">
                <Flex
                    align="center"
                    gap={3}
                >
                    <Image
                        alt="Dreamy UI Logo"
                        boxSize="8"
                        src="/dream.svg"
                    />
                    <Text
                        fontWeight="semibold"
                        size="lg"
                    >
                        Dreamy UI
                    </Text>
                </Flex>
            </Link>

            <HStack
                gap={6}
                justify="center"
            >
                <Link
                    color="fg.medium"
                    to="/docs"
                >
                    Documentation
                </Link>
                <Link
                    color="fg.medium"
                    isExternal
                    to="/github"
                >
                    GitHub
                </Link>
                <Link
                    color="fg.medium"
                    isExternal
                    to="/discord"
                >
                    Discord
                </Link>
                <Link
                    color="fg.medium"
                    isExternal
                    to="/bluesky"
                >
                    Bluesky
                </Link>
            </HStack>

            <Text
                color="fg.medium"
                size="sm"
            >
                Dreamy UI {new Date().getFullYear()}
            </Text>
        </Flex>
    );
}
