import { IconButton, MotionBox, TRANSITION_EASINGS } from "@dreamy-ui/react";
import { Icon } from "@dreamy-ui/react/rsc";
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
                md: "inline-flex"
            }}
            variant={"ghost"}
            overflow={"hidden"}
            pos={"relative"}
            icon={
                <>
                    <MotionBox
                        initial={{ y: 0, scale: 0 }}
                        animate={{ y: isHovered ? -30 : 0, scale: 1 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                        pos={"absolute"}
                    >
                        <Icon as={FaGithub} />
                    </MotionBox>
                    <MotionBox
                        initial={{ y: 0, scale: 0 }}
                        animate={{ y: isHovered ? 0 : 30, scale: 1 }}
                        transition={{
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.easeInOut
                        }}
                        pos={"absolute"}
                    >
                        <Icon
                            as={FaStar}
                            filter={"drop-shadow(0 0 5px rgba(193, 167, 22, 0.5))"}
                            color={"yellow.500"}
                        />
                    </MotionBox>
                </>
            }
            aria-label={"Github"}
        />
    );
}
