import { IconButton, MotionBox, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Icon } from "@dreamy-ui/react/rsc";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { FaGithub, FaStar } from "react-icons/fa";
import { Link } from "./Link";

export default function GithubButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <IconButton
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            asComp={
                <Link
                    isExternal
                    to={`https://github.com/${import.meta.env.VITE_SOURCE_REPO}`}
                />
            }
            display={{
                base: "none",
                md: "flex"
            }}
            variant={"ghost"}
            overflow={"hidden"}
            pos={"relative"}
            icon={
                <>
                    <AnimatePresence
                        initial={false}
                        mode="popLayout"
                    >
                        {!isHovered && (
                            <MotionBox
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    transition: {}
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: TRANSITION_EASINGS.easeInOut
                                }}
                                transformOrigin={"center"}
                                exit={{ scale: 0.6, opacity: 0 }}
                                pos={"absolute"}
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
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
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1
                                }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: TRANSITION_EASINGS.easeInOut
                                }}
                                transformOrigin={"center"}
                                pos={"absolute"}
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Icon
                                    as={FaStar}
                                    filter={"drop-shadow(0 0 5px rgba(193, 167, 22, 0.5))"}
                                    color={"yellow.500"}
                                />
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </>
            }
            aria-label={"Github"}
        />
    );
}
