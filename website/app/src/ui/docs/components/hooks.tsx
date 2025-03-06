import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useActionKey,
    useCanUseDOM,
    useClipboard,
    useColorMode,
    useControllable,
    useEventListener,
    useReducedMotion,
    useToast,
    useUpdateEffect
} from "@dreamy-ui/react";
import { Flex, HStack, Text } from "@dreamy-ui/react/rsc";
import { useCallback, useState } from "react";

export function UseColorMode() {
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();

    return (
        <Flex
            col
            gap={2}
        >
            <Text>Current color mode: {colorMode}</Text>
            <Flex
                wrapped
                gap={2}
            >
                <Button onClick={() => setColorMode("light")}>Light</Button>
                <Button onClick={() => setColorMode("dark")}>Dark</Button>
                <Button onClick={toggleColorMode}>Toggle</Button>
            </Flex>
        </Flex>
    );
}

export function UseReducedMotion() {
    const isReducedMotion = useReducedMotion();

    return <Text>Is reduced motion: {isReducedMotion ? "Yes" : "No"}</Text>;
}

export function UseCanUseDOM() {
    const canUseDOM = useCanUseDOM();

    return <Text>Can use DOM: {canUseDOM ? "Yes" : "No"}</Text>;
}

export function UseActionKey() {
    const actionKey = useActionKey();

    return <Text>Action key: {actionKey}</Text>;
}

export function UseEventListener() {
    const [count, setCount] = useState(() =>
        typeof window === "undefined" ? 0 : Number(localStorage.getItem("count")) || 0
    );

    useEventListener("click", () => {
        setCount((prev) => prev + 1);
        localStorage.setItem("count", count.toString());
    });

    return <Text>Count: {count}</Text>;
}

export function UseControllable() {
    const { toast } = useToast();
    const { isOpen, onOpen, onClose, onToggle, isControlled } = useControllable({
        defaultIsOpen: false,
        onClose: () =>
            toast({
                title: "Close",
                status: "error"
            }),
        onOpen: () =>
            toast({
                title: "Open",
                status: "success"
            })
    });

    return (
        <Flex
            col
            gap={2}
        >
            <Flex
                wrapped
                gap={2}
            >
                <Button onClick={onOpen}>Open</Button>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={onToggle}>Toggle</Button>
            </Flex>
            <Text>Is open: {isOpen ? "Yes" : "No"}</Text>
            <Text>Is controlled: {isControlled ? "Yes" : "No"}</Text>
        </Flex>
    );
}

export function UseControllableModal() {
    const { isOpen, onOpen, onClose } = useControllable();

    return (
        <>
            <Text>Is open: {isOpen ? "Yes" : "No"}</Text>
            <Button onClick={onOpen}>Open</Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Hey!</ModalHeader>
                    <ModalBody>
                        <Text>This is a modal body</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export function UseUpdateEffect() {
    const { toast } = useToast();
    const [count, setCount] = useState(() =>
        typeof window === "undefined" ? 0 : Number(localStorage.getItem("count")) || 0
    );

    useUpdateEffect(() => {
        toast({
            title: `Count is ${count}`,
            status: "info"
        });
    }, [count]);

    return (
        <Flex
            col
            gap={2}
        >
            <Text>Count: {count}</Text>
            <Button
                onClick={() => {
                    setCount((prev) => {
                        const newCount = prev + 1;
                        localStorage.setItem("count", newCount.toString());
                        return newCount;
                    });
                }}
            >
                Increment
            </Button>
        </Flex>
    );
}

export function UseClipboard() {
    const { toast } = useToast();
    const { copy, copied, error, reset } = useClipboard({
        timeout: 2000
    });

    const handleCopy = useCallback(() => {
        const value = "Hello, world!";
        copy(value);
        toast({
            title: "Copied",
            description: value,
            status: "success"
        });
    }, [copy, toast]);

    return (
        <Flex
            col
            gap={2}
            align={"flex-start"}
        >
            <Text>Copied: {copied ? "Yes" : "No"}</Text>
            <Text>Error: {error ? "Yes" : "No"}</Text>
            <HStack>
                <Button onClick={handleCopy}>Copy</Button>
                <Button onClick={reset}>Reset</Button>
            </HStack>
        </Flex>
    );
}
