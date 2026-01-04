import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Popover } from "@/ui";
import { type PlacementWithLogical, useControllable } from "@dreamy-ui/react";
import { useCallback, useRef } from "react";

export function ControlledPopover() {
    const { isOpen, onOpen, onClose } = useControllable();

    const handleDelete = useCallback(() => {
        /**
         * Handle delete logic
         */
        onClose();
    }, [onClose]);

    return (
        <Popover.Root
            hasArrow
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
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
                        onClick={onClose}
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
    const { isOpen, onOpen, onClose } = useControllable();
    const initialFocusRef = useRef<HTMLButtonElement>(null);

    return (
        <Popover.Root
            hasArrow
            initialFocusRef={initialFocusRef}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
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
                        onClick={onClose}
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
                ] satisfies PlacementWithLogical[]
            ).map((placement) => (
                <PlacementPopover
                    key={placement}
                    placement={placement}
                />
            ))}
        </Flex>
    );
}

export function PlacementPopover({ placement }: { placement: PlacementWithLogical }) {
    return (
        <Popover.Root
            hasArrow
            placement={placement}
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
