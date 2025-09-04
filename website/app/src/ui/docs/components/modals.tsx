import { Button } from "@/button";
import { Flex } from "@/flex";
import { Modal } from "@/modal";
import { Text } from "@/text";
import { useControllable } from "@dreamy-ui/react";
import { useCallback } from "react";

function LoremIpsum({ p = 1 }: { p?: number }) {
    const lorem =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    return <Text>{lorem.repeat(p)}</Text>;
}

export function BasicModal() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                variant={"primary"}
                onClick={onOpen}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function SizeModals() {
    const sizes = [
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "8xl"
    ] as const;

    const ModalSize = useCallback(({ size }: { size: (typeof sizes)[number] }) => {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    variant={"primary"}
                    onClick={onOpen}
                    w="fit-content"
                >
                    Open {size} Modal
                </Button>

                <Modal.Root
                    isOpen={isOpen}
                    onClose={onClose}
                    size={size}
                >
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>{size} Modal</Modal.Header>
                        <Modal.CloseButton />
                        <Modal.Body>This is a {size} modal!</Modal.Body>
                        <Modal.Footer>
                            <Button onClick={onClose}>Close</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            </>
        );
    }, []);

    return (
        <Flex
            wrapped
            gap={2}
        >
            {sizes.map((size) => (
                <ModalSize
                    size={size}
                    key={"modal-size-" + size}
                />
            ))}
        </Flex>
    );
}

export function ScrollableInsideModal() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                variant={"primary"}
                onClick={onOpen}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
                size={"lg"}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>
                        {[...Array(10)].map((_, i) => (
                            <LoremIpsum
                                key={`ipsum-inside-${i}`}
                                p={1}
                            />
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function ScrollableOutsideModal() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                variant={"primary"}
                onClick={onOpen}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="outside"
                size={"lg"}
                placement="top"
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>
                        {[...Array(10)].map((_, i) => (
                            <LoremIpsum
                                key={`ipsum-outside-${i}`}
                                p={1}
                            />
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function PlacementModal() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                variant={"primary"}
                onClick={onOpen}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                placement={"top"}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}
