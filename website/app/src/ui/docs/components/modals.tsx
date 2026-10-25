import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Modal } from "@/ui";
import { Text } from "@/ui";
import { useCallback, useState } from "react";

function LoremIpsum({ p = 1 }: { p?: number }) {
    const lorem =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    return <Text>{lorem.repeat(p)}</Text>;
}

export function BasicModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={"primary"}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setOpen(false)}>Close</Button>
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
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button
                    onClick={() => setOpen(true)}
                    variant={"primary"}
                    w="fit-content"
                >
                    Open {size} Modal
                </Button>

                <Modal.Root
                    open={open}
                    onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                    size={size}
                >
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>{size} Modal</Modal.Header>
                        <Modal.CloseButton />
                        <Modal.Body>This is a {size} modal!</Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            </>
        );
    }, []);

    return (
        <Flex
            gap={2}
            wrapped
        >
            {sizes.map((size) => (
                <ModalSize
                    key={"modal-size-" + size}
                    size={size}
                />
            ))}
        </Flex>
    );
}

export function ScrollableInsideModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={"primary"}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
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
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function ScrollableOutsideModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={"primary"}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                placement="top"
                scrollBehavior="outside"
                size={"lg"}
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
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function PlacementModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={"primary"}
                w="fit-content"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                placement={"top"}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Modal Body</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}
