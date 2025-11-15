import { Flex } from "@/flex";
import { MotionFlex } from "@/motion";
import { TRANSITION_EASINGS } from "@dreamy-ui/react";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";
import { useIsMobile } from "~/src/hooks/useIsMobile";
import BlurryGradients from "./BlurryGradients";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./mobile/MobileMenu";

export default function AppLayout({ children }: PropsWithChildren) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMobile = useIsMobile();

    const isDocs = useLocation().pathname.includes("/docs");

    return (
        <>
            <MotionFlex
                animate={{
                    x: isMenuOpen ? "-80vw" : 0
                }}
                col
                flex={1}
                transition={{
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
                w={"full"}
            >
                <Header
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
                <Flex
                    alignItems={"flex-start"}
                    column
                    flex={1}
                    full
                    gap={10}
                    maxW={"7xl"}
                    mt={{
                        base: isDocs ? 0 : 10,
                        md: 20
                    }}
                    mx="auto"
                    pos={"relative"}
                    px={4}
                >
                    {children}
                </Flex>
                <Footer />
                <BlurryGradients />
            </MotionFlex>

            {isMobile && (
                <MobileMenu
                    isOpen={isMenuOpen}
                    setIsOpen={setIsMenuOpen}
                />
            )}
        </>
    );
}
