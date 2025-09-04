import { Button } from "@/button";
import { Flex } from "@/flex";
import { Popover } from "@/popover";
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
            onOpen={onOpen}
            onClose={onClose}
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
                        variant={"solid"}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={"primary"}
                        onClick={handleDelete}
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
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
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
                        variant={"solid"}
                        onClick={onClose}
                        ref={initialFocusRef}
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
            wrapped
            gap={5}
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
            wrapped
            gap={5}
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
