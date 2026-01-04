"use client";

import { Icon, IconButton } from "@/ui";
import { useColorMode } from "@dreamy-ui/react";
import { Moon, Sun } from "lucide-react";
import { m } from "motion/react";

const MotionIconButton = m.create(IconButton);

export default function ColorModeSwitch() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <MotionIconButton
            _hover={{
                bg: {
                    _dark: "yellow.300/20",
                    base: "purple.600/20"
                }
            }}
            aria-label="Toggle color mode"
            bg={{
                _dark: "yellow.300/15",
                base: "purple.600/15"
            }}
            bottom={5}
            color={{
                _dark: "yellow.300",
                base: "purple.600"
            }}
            fixed
            onClick={toggleColorMode}
            right={5}
            rounded={"xl"}
            transition={{
                duration: 0.1,
                ease: "easeInOut",
                delay: 0
            }}
            whileHover={{
                rotate: colorMode === "light" ? 15 : -15
            }}
        >
            <Icon
                as={colorMode === "light" ? Sun : Moon}
                boxSize={"5"}
            />
        </MotionIconButton>
    );
}
