import { Button, Modal } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Modal"
} satisfies Meta;

export function Base() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
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
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="primary"
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
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                scrollBehavior="inside"
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

export function ScrollBehaviorOutside() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
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
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function Placement() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
            >
                Open Modal
            </Button>

            <Modal.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                placement="top"
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
