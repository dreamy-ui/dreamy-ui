import { Button, Image, MotionBox, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Badge, Box, Divider, HStack, Heading, Icon } from "@dreamy-ui/react/rsc";
import { useLocation } from "@remix-run/react";
import { useState } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { Link } from "~/src/ui/global/Link";

export function Logo() {
    const [isHovered, setIsHovered] = useState(false);

    const path = useLocation().pathname;

    return (
        <HStack gap={4}>
            <HStack
                asComp={<Link to={"/"} />}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    h={"4"}
                    src={"/dream.svg"}
                    alt={"Dreamy UI Logo"}
                />
                <Box
                    overflow={"hidden"}
                    h="30px"
                >
                    <MotionBox
                        initial={{ y: 0 }}
                        animate={{ y: isHovered ? -30 : 0 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                    >
                        <Heading
                            size={"xl"}
                            bold
                        >
                            Dreamy UI
                        </Heading>
                    </MotionBox>
                    <MotionBox
                        initial={{ y: 0 }}
                        animate={{ y: isHovered ? -30 : 0 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                    >
                        <Heading
                            size={"xl"}
                            bold
                        >
                            Your UI
                        </Heading>
                    </MotionBox>
                </Box>
                <Badge scheme={"secondary"}>Beta</Badge>
            </HStack>

            <Divider
                orientation="vertical"
                h={10}
                display={{
                    base: "none",
                    md: path.startsWith("/docs") ? "inline-flex" : "none"
                }}
            />

            <Button
                display={{
                    base: "none",
                    md: path.startsWith("/docs") ? "inline-flex" : "none"
                }}
                asComp={<Link to={"/sponsor"} />}
                variant={"link"}
                size={"sm"}
                leftIcon={
                    <Icon
                        as={MdOutlineFavorite}
                        color={"error"}
                    />
                }
            >
                Sponsor
            </Button>
        </HStack>
    );
}
