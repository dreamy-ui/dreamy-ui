import { IconButton, useEventListener } from "@dreamy-ui/react";
import { Flex, HStack } from "@dreamy-ui/react/rsc";
import { memo, useState } from "react";
import { Link } from "~/src/ui/global/Link";
import Search from "~/src/ui/global/Search";
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
            borderColor={hasScrolled ? "border.default" : "transparent"}
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
                <MemoLogo />

                <HStack
                    gap={{
                        base: 2,
                        md: 4
                    }}
                >
                    <Link
                        to={"/discord"}
                        isExternal
                        mr={4}
                        prefetch="none"
                        display={{
                            base: "none",
                            md: "inline-flex"
                        }}
                    >
                        Discord
                    </Link>
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
                    <MemoSearch />

                    <MemoToggleThemeButton />

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

const MemoLogo = memo(Logo);
const MemoSearch = memo(Search);
const MemoToggleThemeButton = memo(ToggleThemeButton);
