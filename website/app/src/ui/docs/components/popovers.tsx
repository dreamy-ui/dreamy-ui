import {
    Button,
    type PlacementWithLogical,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    useControllable
} from "@dreamy-ui/react";
import { Flex } from "@dreamy-ui/react/rsc";
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
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        >
            <PopoverTrigger>
                <Button
                    variant={"primary"}
                    w="fit-content"
                >
                    Open Popover
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete Post</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete this post? This action cannot be undone.
                </PopoverBody>
                <PopoverFooter>
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
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export function FocusPopover() {
    const { isOpen, onOpen, onClose } = useControllable();
    const initialFocusRef = useRef<HTMLButtonElement>(null);

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
        >
            <PopoverTrigger>
                <Button
                    variant={"primary"}
                    w="fit-content"
                >
                    Open Popover
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete Post</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete this post? This action cannot be undone.
                </PopoverBody>
                <PopoverFooter>
                    <Button
                        variant={"solid"}
                        onClick={onClose}
                        ref={initialFocusRef}
                    >
                        Cancel
                    </Button>
                    <Button variant={"primary"}>Delete</Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
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
        <Popover placement={placement}>
            <PopoverTrigger>
                <Button
                    variant={"primary"}
                    w="fit-content"
                >
                    {placement}
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete Post</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete this post? This action cannot be undone.
                </PopoverBody>
                <PopoverFooter>
                    <Button variant={"primary"}>Delete</Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export function SizePopover({ size }: { size: string }) {
    return (
        <Popover size={size as any}>
            <PopoverTrigger>
                <Button
                    variant={"primary"}
                    w="fit-content"
                >
                    {size}
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete Post</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete this post? This action cannot be undone.
                </PopoverBody>
                <PopoverFooter>
                    <Button variant={"primary"}>Delete</Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export function SizePopovers() {
    return (
        <Flex
            wrapped
            gap={5}
        >
            {(
                ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"]
            ).map((size) => (
                <SizePopover key={size} size={size} />
            ))}
        </Flex>
    );
}