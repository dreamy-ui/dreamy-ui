import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { IconButton } from "@/icon-button";
import { Image } from "@/image";
import { Text } from "@/text";
import { TRANSITION_EASINGS, useColorMode } from "@dreamy-ui/react";
import { AnimatePresence, m } from "motion/react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "../Link";

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Route {
    name: string;
    link: string;
    isExternal?: boolean;
}

const routes: Route[] = [
    {
        name: "Homepage",
        link: "/"
    },
    {
        name: "Docs",
        link: "/docs"
    },
    {
        name: "Github",
        link: `https://github.com/${import.meta.env.VITE_SOURCE_REPO}`,
        isExternal: true
    },
    {
        name: "Discord",
        link: "/discord",
        isExternal: true
    }
];

export default function MobileMenu({ isOpen, setIsOpen }: Props) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <AnimatePresence>
            <m.div
                initial={{ x: "80vw" }}
                animate={{ x: isOpen ? 0 : "80vw" }}
                transition={{
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "80vw",
                    zIndex: 9999
                }}
            >
                <Flex
                    gap={10}
                    py={4}
                    px={6}
                    flexDir={"column"}
                    h="100vh"
                    w={"100%"}
                    borderLeft={"1px solid"}
                    borderColor={"alpha.300"}
                    bg={{
                        base: "white",
                        _dark: "black"
                    }}
                >
                    <Flex
                        w="100%"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Image
                            src={"/dream.svg"}
                            alt="Dream Logo"
                            h={"5"}
                        />

                        <IconButton
                            variant={"ghost"}
                            aria-label="Close Menu"
                            icon={
                                <Icon
                                    as={BsArrowRight}
                                    boxSize={"5"}
                                />
                            }
                            onClick={() => setIsOpen(false)}
                        />
                    </Flex>

                    <Flex
                        w="100%"
                        flexDir={"column"}
                        gap={10}
                        itemsCenter
                        contentCenter
                        flex={1}
                        pb={40}
                    >
                        {routes.map((route) => (
                            <Link
                                key={route.name}
                                to={route.link}
                                size={"2xl"}
                                fontWeight={600}
                                onClick={() => setIsOpen(false)}
                                _hover={{
                                    textDecoration: "none",
                                    color: "brand"
                                }}
                                isExternal={route.isExternal}
                            >
                                {route.name}
                            </Link>
                        ))}

                        <Text
                            size={"2xl"}
                            fontWeight={600}
                            onClick={toggleColorMode}
                        >
                            Toggle {colorMode === "light" ? "Dark" : "Light"}
                        </Text>

                        <Text
                            size={"2xl"}
                            fontWeight={600}
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </Text>
                    </Flex>
                </Flex>
            </m.div>
        </AnimatePresence>
    );
}
