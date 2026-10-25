import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Popover } from "@/ui";
import { type Placement } from "@dreamy-ui/react";
import { useCallback, useRef, useState } from "react";

export function ControlledPopover() {
    const [open, setOpen] = useState(false);

    const handleDelete = useCallback(() => {
        /**
         * Handle delete logic
         */
        setOpen(false);
    }, []);

    return (
        <Popover.Root
            hasArrow
            open={open}
            onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
        >
            <Popover.Trigger>
                <Button
                    variant={"primary"}
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
                    <Button
                        onClick={() => setOpen(false)}
                        variant={"solid"}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant={"primary"}
                    >
                        Delete
                    </Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function FocusPopover() {
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
                <Button
                    variant={"primary"}
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
                    <Button
                        onClick={() => setOpen(false)}
                        ref={initialFocusRef}
                        variant={"solid"}
                    >
                        Cancel
                    </Button>
                    <Button variant={"primary"}>Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function PlacementPopovers() {
    return (
        <Flex
            gap={5}
            wrapped
        >
            {(
                [
                    "top",
                    "bottom",
                    "left",
                    "right",
                    "top-start",
                    "top-end",
                    "bottom-start",
                    "bottom-end",
                    "left-start",
                    "left-end",
                    "right-start",
                    "right-end"
                ] satisfies Placement[]
            ).map((placement) => (
                <PlacementPopover
                    key={placement}
                    placement={placement}
                />
            ))}
        </Flex>
    );
}

export function PlacementPopover({ placement }: { placement: Placement }) {
    return (
        <Popover.Root
            hasArrow
            positioning={{ placement }}
        >
            <Popover.Trigger>
                <Button
                    variant={"primary"}
                    w="fit-content"
                >
                    {placement}
                </Button>
            </Popover.Trigger>

            <Popover.Content>
                <Popover.CloseButton />
                <Popover.Header>Delete Post</Popover.Header>
                <Popover.Body>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Popover.Body>
                <Popover.Footer>
                    <Button variant={"primary"}>Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function SizePopover({ size }: { size: string }) {
    return (
        <Popover.Root
            hasArrow
            size={size as any}
        >
            <Popover.Trigger>
                <Button
                    variant={"primary"}
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
                    <Button variant={"primary"}>Delete</Button>
                </Popover.Footer>
            </Popover.Content>
        </Popover.Root>
    );
}

export function SizePopovers() {
    return (
        <Flex
            gap={5}
            wrapped
        >
            {["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"].map(
                (size) => (
                    <SizePopover
                        key={size}
                        size={size}
                    />
                )
            )}
        </Flex>
    );
}
