import { Box, Button, Collapse, Scale, Text, VStack } from "@/ui";
import { useControllable } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Transitions"
} satisfies Meta;

export function CollapseBasic() {
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                isOpen={isOpen}
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
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Scale
                isOpen={isOpen}
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

const LONG_TEXT =
    "Dreamy UI is a modern React component library built for accessible, themeable interfaces. It pairs headless hooks with Panda CSS recipes so you can compose buttons, overlays, forms, and layout primitives without fighting your design system. Transitions like Collapse make it easy to reveal long copy, FAQ answers, or descriptions without a jarring layout shift. Each component is designed to be copied into your project, customized with tokens, and extended with the same patterns you see in the docs. Whether you are building a marketing page, a dashboard, or a complex form flow, Dreamy UI gives you polished defaults with room to adapt every detail.";

export function TextCollapse() {
    const { isOpen, onToggle } = useControllable();

    return (
        <VStack
            alignItems="flex-start"
            gap={2}
            w="full"
        >
            <Collapse
                animateOpacity={false}
                endingHeight="auto"
                isOpen={isOpen}
                startingHeight="4.5em"
                w="full"
            >
                <Text>{LONG_TEXT}</Text>
            </Collapse>
            <Button
                alignSelf="flex-start"
                color="primary"
                onClick={onToggle}
                variant="link"
                whiteSpace="nowrap"
            >
                {isOpen ? "Show less" : "Show more"}
            </Button>
        </VStack>
    );
}

export function CollapseWithHeight() {
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                endingHeight={80}
                isOpen={isOpen}
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
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                animateOpacity={false}
                isOpen={isOpen}
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
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Collapse
                isOpen={isOpen}
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
    const { isOpen, onToggle } = useControllable();

    return (
        <>
            <Button
                onClick={onToggle}
                w="min-content"
            >
                Toggle
            </Button>
            <Scale
                initialScale={0}
                isOpen={isOpen}
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
