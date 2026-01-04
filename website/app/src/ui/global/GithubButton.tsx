import { Icon } from "@/ui";
import { IconButton } from "@/ui";
import { MotionBox } from "@/ui";
import { TRANSITION_EASINGS } from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { FaGithub, FaStar } from "react-icons/fa";
import { Link } from "./Link";

export default function GithubButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <IconButton
            aria-label={"Github"}
            as={
                <Link
                    isExternal
                    to={`https://github.com/${import.meta.env.VITE_SOURCE_REPO}`}
                />
            }
            display={{
                base: "none",
                md: "flex"
            }}
            icon={
                <>
                    <AnimatePresence
                        initial={false}
                        mode="popLayout"
                    >
                        {!isHovered && (
                            <MotionBox
                                alignItems={"center"}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    transition: {}
                                }}
                                bottom={0}
                                display={"flex"}
                                exit={{ scale: 0.6, opacity: 0 }}
                                initial={{ scale: 0.9, opacity: 0 }}
                                justifyContent={"center"}
                                left={0}
                                pos={"absolute"}
                                right={0}
                                top={0}
                                transformOrigin={"center"}
                                transition={{
                                    duration: 0.3,
                                    ease: TRANSITION_EASINGS.easeInOut
                                }}
                            >
                                <Icon as={FaGithub} />
                            </MotionBox>
                        )}
                    </AnimatePresence>
                    <AnimatePresence
                        initial={false}
                        mode="popLayout"
                    >
                        {isHovered && (
                            <MotionBox
                                alignItems={"center"}
                                animate={{
                                    scale: 1,
                                    opacity: 1
                                }}
                                bottom={0}
                                display={"flex"}
                                exit={{ scale: 0.6, opacity: 0 }}
                                initial={{ scale: 0.9, opacity: 0 }}
                                justifyContent={"center"}
                                left={0}
                                pos={"absolute"}
                                right={0}
                                top={0}
                                transformOrigin={"center"}
                                transition={{
                                    duration: 0.3,
                                    ease: TRANSITION_EASINGS.easeInOut
                                }}
                            >
                                <Icon
                                    as={FaStar}
                                    color={"yellow.500"}
                                    filter={"drop-shadow(0 0 5px rgba(193, 167, 22, 0.5))"}
                                />
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </>
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            overflow={"hidden"}
            pos={"relative"}
            variant={"ghost"}
        />
    );
}
