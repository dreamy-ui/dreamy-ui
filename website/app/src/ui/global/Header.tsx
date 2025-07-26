import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { IconButton } from "@/icon-button";
import { HStack } from "@/stack";
import { Text } from "@/text";
import { useEventListener } from "@dreamy-ui/react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Link } from "~/src/ui/global/Link";
import Search from "~/src/ui/global/Search";
import GithubButton from "./GithubButton";
import { Logo } from "./Logo";
import { ToggleThemeButton } from "./ToggleThemeButton";
import HamburgerMenu from "./mobile/HamburgerMenu";

interface Props {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: Props) {
    const [hasScrolled, setHasScrolled] = useState(false);

    useEventListener(
        "scroll",
        () => {
            if (window.scrollY > 0 && !hasScrolled) {
                setHasScrolled(true);
            } else if (window.scrollY === 0 && hasScrolled) {
                setHasScrolled(false);
            }
        },
        null,
        { fireOnMount: true }
    );

    return (
        <Flex
            full
            h={16}
            itemsCenter
            row
            bg={"color-mix(in srgb, {colors.bg} 70%, transparent 10%)"}
            as={"header"}
            borderBottom={"1px solid"}
            borderColor={hasScrolled ? "border" : "transparent"}
            contentBetween
            pos={"sticky"}
            top={0}
            backdropBlur={"sm"}
            backdropFilter={"auto"}
            zIndex={"sticky"}
            transition={"all 0.15s"}
            transitionTimingFunction={"ease-out"}
        >
            <Flex
                mx={"auto"}
                full
                maxW={"7xl"}
                contentBetween
                px={4}
            >
                <Logo />

                <HStack
                    gap={{
                        base: 2,
                        md: 4
                    }}
                    itemsStart
                >
                    <HStack
                        className="group"
                        asComp={
                            <Link
                                to={"/discord"}
                                isExternal
                                mr={4}
                                prefetch="none"
                                display={{
                                    base: "none",
                                    md: "inline-flex"
                                }}
                            />
                        }
                        // add shadow on hover as filter
                    >
                        <Icon
                            as={FaDiscord}
                            h={4}
                            transition={
                                "filter {durations.normal} {easings.easeInOut}, color {durations.fastest} {easings.easeInOut}"
                            }
                            _groupHover={{
                                filter: "drop-shadow(0 0 4px #5865F2)",
                                color: "#5865F2"
                            }}
                        />
                        <Text
                            transition={
                                "filter {durations.normal} {easings.easeInOut}, color {durations.fastest} {easings.easeInOut}"
                            }
                            _groupHover={{
                                filter: "drop-shadow(0 0 4px #5865F2)",
                                color: "#5865F2"
                            }}
                        >
                            Discord
                        </Text>
                    </HStack>

                    <Link
                        to={"/docs"}
                        prefetch="intent"
                        display={{
                            base: "none",
                            md: "inline-flex"
                        }}
                    >
                        Docs
                    </Link>
                    <Search />

                    <GithubButton />
                    <ToggleThemeButton />

                    <IconButton
                        display={{
                            base: "inline-flex",
                            md: "none"
                        }}
                        _hover={{
                            bg: "transparent"
                        }}
                        variant={"ghost"}
                        icon={<HamburgerMenu isOpen={isMenuOpen} />}
                        aria-label={`${isMenuOpen ? "Close" : "Open"} Menu`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                </HStack>
            </Flex>
        </Flex>
    );
}
