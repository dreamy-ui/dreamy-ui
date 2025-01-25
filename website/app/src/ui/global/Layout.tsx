import { MotionFlex, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Box, Flex } from "@dreamy-ui/react/rsc";
import { useLocation } from "@remix-run/react";
import { type PropsWithChildren, useState } from "react";
import { useIsMobile } from "~/src/hooks/useIsMobile";
import Header from "~/src/ui/global/Header";
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
				<Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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

				<Box pos={"fixed"} inset={0} zIndex={-10} overflow={"hidden"}>
					{/* right top */}
					<Box
						pos={"absolute"}
						bottom={"auto"}
						left={"auto"}
						right={0}
						top={0}
						w={"500px"}
						h={"500px"}
						x={{
							base: "0%",
							md: "-30%"
						}}
						y={"20%"}
						translate={"auto"}
						rounded={"full"}
						bg={"rgb(73, 31, 171)"}
						opacity={{
							_light: 0.15,
							_dark: 0.1
						}}
						blur={"80px"}
						filter={"auto"}
					/>
					{/* bottom left */}
					<Box
						pos={"absolute"}
						bottom={"auto"}
						right={"auto"}
						left={0}
						top={0}
						w={"750px"}
						h={"750px"}
						x={"-20%"}
						y={{
							base: "110%",
							md: "150%"
						}}
						translate={"auto"}
						rounded={"full"}
						bg={"rgb(205, 60, 190)"}
						opacity={{
							_light: 0.15,
							_dark: 0.1
						}}
						blur={"80px"}
						filter={"auto"}
					/>
				</Box>
			</MotionFlex>

			{isMobile && (
				<MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
			)}

			{/* radial gradient */}
			{/* <Box zIndex={-1} pos={"absolute"} top={0} left={0} right={0} h={"90vh"} /> */}
		</>
	);
}
