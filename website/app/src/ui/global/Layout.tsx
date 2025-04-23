import { MotionFlex, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Flex } from "@dreamy-ui/react/rsc";
import { useLocation } from "@remix-run/react";
import { type PropsWithChildren, useState } from "react";
import { useIsMobile } from "~/src/hooks/useIsMobile";
import Header from "~/src/ui/global/Header";
import BlurryGradients from "./BlurryGradients";
import Footer from "./Footer";
import MobileMenu from "./mobile/MobileMenu";

export default function AppLayout({ children }: PropsWithChildren) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMobile = useIsMobile();

    const isDocs = useLocation().pathname.includes("/docs");

    return (
        <>
            <MotionFlex
                flex={1}
                w={"full"}
                animate={{
                    x: isMenuOpen ? "-80vw" : 0
                }}
                transition={{
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
                col
            >
                <Header
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
                <Flex
                    full
                    mt={{
                        base: isDocs ? 0 : 10,
                        md: 20
                    }}
                    column
                    gap={10}
                    maxW={"7xl"}
                    flex={1}
                    mx="auto"
                    alignItems={"flex-start"}
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

            {/* radial gradient */}
            {/* <Box zIndex={-1} pos={"absolute"} top={0} left={0} right={0} h={"90vh"} /> */}
        </>
    );
}
