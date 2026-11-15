import { Button, Flex, Group, IconButton } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { IoCheckmarkDone, IoClose, IoCopyOutline } from "react-icons/io5";

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
            <Button variant="filledOutline">Filled Outline</Button>
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
            <Button size="xl">Extra Large</Button>
            <Button size="2xl">2XL</Button>
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

export function Success() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button
                isSuccess
                variant="primary"
            >
                Save
            </Button>
            <Button
                isSuccess
                successText="Saved"
                variant="outline"
            >
                Save
            </Button>
            <Button
                isSuccess
                successIcon={<IoCheckmarkDone />}
                successText="Done"
                variant="ghost"
            >
                Mark as done
            </Button>
            <IconButton
                aria-label="Copy"
                icon={<IoCopyOutline />}
                isSuccess
                variant="outline"
            />
        </Flex>
    );
}

export function SuccessVariants() {
    return (
        <Flex
            gap={2}
            wrapped
        >
            <Button
                isSuccess
                successText="Primary"
                variant="primary"
            />
            <Button
                isSuccess
                successText="Secondary"
                variant="secondary"
            />
            <Button
                isSuccess
                successText="Solid"
                variant="solid"
            />
            <Button
                isSuccess
                successText="Outline"
                variant="outline"
            />
            <Button
                isSuccess
                successText="Filled Outline"
                variant="filledOutline"
            />
            <Button
                isSuccess
                successText="Ghost"
                variant="ghost"
            />
            <Button
                isSuccess
                successText="Link"
                variant="link"
            />
        </Flex>
    );
}

type SaveStatus = "idle" | "loading" | "success";

export function SuccessFlow() {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    function handleClick() {
        clearTimeout(timeoutRef.current);
        setStatus("loading");
        timeoutRef.current = setTimeout(() => {
            setStatus("success");
            timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
        }, 1200);
    }

    return (
        <Button
            isLoading={status === "loading"}
            isSuccess={status === "success"}
            loadingText="Saving"
            onClick={handleClick}
            successText="Saved"
            variant="primary"
            w="fit-content"
        >
            Save changes
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
