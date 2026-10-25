import { Button, Popover } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useCallback, useRef, useState } from "react";

export default {
    title: "Popover"
} satisfies Meta;

export function Base() {
    return (
        <Popover.Root hasArrow>
            <Popover.Trigger>
                <Button
                    variant="primary"
                    w="fit-content"
                >
                    Open Popover
                </Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function CustomPortalContainer() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef}>
            <Popover.Root portalProps={{ containerRef }}>
                <Popover.Trigger>
                    <Button variant="primary">Open contained Popover</Button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Body>Rendered in the supplied portal container.</Popover.Body>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
}

export function ControlledPopover() {
    const [open, setOpen] = useState(false);

    const handleDelete = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <Popover.Root
            hasArrow
            open={open}
            onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
        >
            <Popover.Trigger>
                <Button variant="primary">Open Popover</Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button
                        onClick={() => setOpen(false)}
                        variant="solid"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="primary"
                    >
                        Delete
                    </Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function InitialFocus() {
    const [open, setOpen] = useState(false);
    const initialFocusRef = useRef<HTMLButtonElement>(null);

    return (
        <Popover.Root
            hasArrow
            initialFocusRef={initialFocusRef}
            open={open}
            onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
        >
            <Popover.Trigger>
                <Button variant="primary">Open Popover</Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button
                        onClick={() => setOpen(false)}
                        ref={initialFocusRef}
                        variant="solid"
                    >
                        Cancel
                    </Button>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function Sizes() {
    return (
        <>
            {(
                ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"] as const
            ).map((size) => (
                <Popover.Root
                    hasArrow
                    key={size}
                    size={size}
                >
                    <Popover.Trigger>
                        <Button
                            variant="primary"
                            w="fit-content"
                        >
                            {size}
                        </Button>
                    </Popover.Trigger>

                    <Popover.Content>
                        <Popover.CloseButton />
                        <Popover.Header>Delete Post</Popover.Header>
                        <Popover.Body>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </Popover.Body>
                        <Popover.Footer>
                            <Button variant="primary">Delete</Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Root>
            ))}
        </>
    );
}

export function ReduceMotion() {
    return (
        <Popover.Root
            hasArrow
            reduceMotion
        >
            <Popover.Trigger>
                <Button
                    variant="primary"
                    w="fit-content"
                >
                    Reduced Motion
                </Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button variant="primary">Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}
