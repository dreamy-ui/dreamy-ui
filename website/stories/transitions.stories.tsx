import { Box, Button, Collapse, Scale } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Transitions"
} satisfies Meta;

export function CollapseBasic() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                in={isOpen}
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Collapse>
        </>
    );
}

export function ScaleBasic() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Scale
                in={isOpen}
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Scale>
        </>
    );
}

export function CollapseWithHeight() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                endingHeight={80}
                in={isOpen}
                startingHeight={10}
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Collapse>
        </>
    );
}

export function AnimateOpacity() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                animateOpacity={false}
                in={isOpen}
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Collapse>
        </>
    );
}

export function UnmountOnExit() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                in={isOpen}
                unmountOnExit
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Collapse>
        </>
    );
}

export function ScaleWithInitialScale() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                w="min-content"
            >
                Toggle
            </Button>
            <Scale
                in={isOpen}
                initialScale={0}
                w="full"
            >
                <Box
                    bg="fg"
                    color="bg"
                    p={4}
                    rounded="md"
                    w="full"
                >
                    Hello
                </Box>
            </Scale>
        </>
    );
}
