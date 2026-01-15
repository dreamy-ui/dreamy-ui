import { Button, Modal } from "@/ui";
import { useControllable } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Modal"
} satisfies Meta;

export function Base() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
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

export function Sizes() {
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

    function ModalSize({ size }: { size: (typeof sizes)[number] }) {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant="primary"
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
    }

    return (
        <>
            {sizes.map((size) => (
                <ModalSize
                    key={size}
                    size={size}
                />
            ))}
        </>
    );
}

export function ScrollBehaviorInside() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
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

export function ScrollBehaviorOutside() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                placement="top"
                scrollBehavior="outside"
                size="lg"
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Header</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>
                        {[...Array(10)].map((_, i) => (
                            <p key={i}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                nec odio vel dui euismod fermentum.
                            </p>
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

export function Placement() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                placement="top"
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
