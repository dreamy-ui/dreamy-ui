import { Button, Flex, Group } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { HiOutlineMail } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default {
    title: "Button"
} satisfies Meta;

export function Base() {
    return <Button w="fit-content">Button</Button>;
}

export function Variants() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="solid">Solid</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
        </Flex>
    );
}

export function Sizes() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </Flex>
    );
}

export function Color() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button
                scheme="success"
                variant="solid"
            >
                Solid success
            </Button>
            <Button
                scheme="warning"
                variant="outline"
            >
                Outline warning
            </Button>
            <Button
                scheme="error"
                variant="ghost"
            >
                Ghost error
            </Button>
        </Flex>
    );
}

export function LeftIcon() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button leftIcon={<IoClose />}>Cancel</Button>
            <Button
                leftIcon={<HiOutlineMail />}
                variant="primary"
            >
                Home
            </Button>
        </Flex>
    );
}

export function RightIcon() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button rightIcon={<IoClose />}>Cancel</Button>
            <Button
                rightIcon={<HiOutlineMail />}
                variant="primary"
            >
                Home
            </Button>
        </Flex>
    );
}

export function Disabled() {
    return (
        <Button
            isDisabled
            w="fit"
        >
            Disabled
        </Button>
    );
}

export function Loading() {
    return (
        <Button
            isLoading
            variant="primary"
            w="fit-content"
        >
            Loading
        </Button>
    );
}

export function LoadingWithLabel() {
    return (
        <Button
            isLoading
            loadingText="Loading"
            variant="primary"
            w="fit-content"
        >
            Loading
        </Button>
    );
}

export function LoadingWithLabelEnd() {
    return (
        <Button
            isLoading
            loadingText="Loading"
            spinnerPlacement="end"
            variant="primary"
            w="fit-content"
        >
            Loading
        </Button>
    );
}

export function DisableRipple() {
    return (
        <Button
            disableRipple
            w="fit-content"
        >
            Disabled Ripple
        </Button>
    );
}

export function ButtonGroup() {
    return (
        <Group attached>
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
            <Button variant="outline">Button 3</Button>
        </Group>
    );
}
