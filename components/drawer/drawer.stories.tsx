import { Button, Drawer, Flex } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Drawer"
} satisfies Meta;

export function Base() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
            >
                Open Drawer
            </Button>

            <Drawer.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Drawer Header</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>Drawer Body</Drawer.Body>
                    <Drawer.Footer>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}

export function Variants() {
    const variants = ["inset", "simple"] as const;

    function DrawerVariant({ variant }: { variant: (typeof variants)[number] }) {
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="primary"
                >
                    Open {variant} Drawer
                </Button>

                <Drawer.Root
                    open={open}
                    onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                    variant={variant}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>{variant} Drawer</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>
                            This is the {variant} variant. Inset floats with spacing and rounding;
                            simple is flush to the viewport edge.
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Root>
            </>
        );
    }

    return (
        <Flex gap={2}>
            {variants.map((variant) => (
                <DrawerVariant
                    key={variant}
                    variant={variant}
                />
            ))}
        </Flex>
    );
}

export function Placements() {
    const placements = ["right", "left", "top", "bottom"] as const;

    function DrawerPlacement({ placement }: { placement: (typeof placements)[number] }) {
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="primary"
                >
                    Open {placement} Drawer
                </Button>

                <Drawer.Root
                    open={open}
                    onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                    placement={placement}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>{placement} Drawer</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>Slides in from the {placement}.</Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Root>
            </>
        );
    }

    return (
        <Flex
            gap={2}
            wrapped
        >
            {placements.map((placement) => (
                <DrawerPlacement
                    key={placement}
                    placement={placement}
                />
            ))}
        </Flex>
    );
}

export function Sizes() {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "full"] as const;

    function DrawerSize({ size }: { size: (typeof sizes)[number] }) {
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button
                    onClick={() => setOpen(true)}
                    variant="primary"
                >
                    Open {size} Drawer
                </Button>

                <Drawer.Root
                    open={open}
                    onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                    size={size}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>{size} Drawer</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>This is a {size} drawer.</Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Root>
            </>
        );
    }

    return (
        <Flex
            gap={2}
            wrapped
        >
            {sizes.map((size) => (
                <DrawerSize
                    key={size}
                    size={size}
                />
            ))}
        </Flex>
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
                Open Drawer
            </Button>

            <Drawer.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                scrollBehavior="inside"
                size="lg"
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Scroll Inside</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>
                        {[...Array(20)].map((_, i) => (
                            <p key={i}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                nec odio vel dui euismod fermentum.
                            </p>
                        ))}
                    </Drawer.Body>
                    <Drawer.Footer>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}
