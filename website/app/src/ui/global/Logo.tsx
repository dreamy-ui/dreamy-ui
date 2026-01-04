import { Badge } from "@/ui";
import { Box } from "@/ui";
import { Button } from "@/ui";
import { Divider } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Image } from "@/ui";
import { MotionBox } from "@/ui";
import { HStack } from "@/ui";
import { TRANSITION_EASINGS } from "@dreamy-ui/react";
import { useState } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useLocation } from "react-router";
import { Link } from "~/src/ui/global/Link";

export function Logo() {
    const [isHovered, setIsHovered] = useState(false);

    const path = useLocation().pathname;

    return (
        <HStack gap={4}>
            <HStack
                as={<Link to={"/"} />}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    alt={"Dreamy UI Logo"}
                    boxSize={"8"}
                    src={"/dream.svg"}
                />
                <Box
                    h="30px"
                    overflow={"hidden"}
                >
                    <MotionBox
                        animate={{ y: isHovered ? -30 : 0 }}
                        initial={{ y: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                    >
                        <Heading size={"xl"}>Dreamy UI</Heading>
                    </MotionBox>
                    <MotionBox
                        animate={{ y: isHovered ? -30 : 0 }}
                        initial={{ y: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                    >
                        <Heading size={"xl"}>Your UI</Heading>
                    </MotionBox>
                </Box>
                <Badge scheme={"secondary"}>v2</Badge>
            </HStack>

            <Divider
                display={{
                    base: "none",
                    md: path.startsWith("/docs") ? "inline-flex" : "none"
                }}
                h={10}
                orientation="vertical"
            />

            <Button
                as={
                    <Link
                        isExternal
                        to={"/sponsor"}
                    />
                }
                display={{
                    base: "none",
                    md: path.startsWith("/docs") ? "inline-flex" : "none"
                }}
                leftIcon={
                    <Icon
                        as={MdOutlineFavorite}
                        color={"error"}
                    />
                }
                size={"sm"}
                variant={"link"}
            >
                Sponsor
            </Button>
        </HStack>
    );
}
