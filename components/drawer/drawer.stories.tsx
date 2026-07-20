import { Button, Drawer, Flex } from "@/ui";
import { useControllable } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Drawer"
} satisfies Meta;

export function Base() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
            >
                Open Drawer
            </Button>

            <Drawer.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Drawer Header</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>Drawer Body</Drawer.Body>
                    <Drawer.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}

export function Variants() {
    const variants = ["inset", "simple"] as const;

    function DrawerVariant({ variant }: { variant: (typeof variants)[number] }) {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant="primary"
                >
                    Open {variant} Drawer
                </Button>

                <Drawer.Root
                    isOpen={isOpen}
                    onClose={onClose}
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
                            <Button onClick={onClose}>Close</Button>
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
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant="primary"
                >
                    Open {placement} Drawer
                </Button>

                <Drawer.Root
                    isOpen={isOpen}
                    onClose={onClose}
                    placement={placement}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>{placement} Drawer</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>Slides in from the {placement}.</Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={onClose}>Close</Button>
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
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant="primary"
                >
                    Open {size} Drawer
                </Button>

                <Drawer.Root
                    isOpen={isOpen}
                    onClose={onClose}
                    size={size}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>{size} Drawer</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>This is a {size} drawer.</Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={onClose}>Close</Button>
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
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
            >
                Open Drawer
            </Button>

            <Drawer.Root
                isOpen={isOpen}
                onClose={onClose}
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
                        <Button onClick={onClose}>Close</Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}
