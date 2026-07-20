import { Button, Drawer, Flex, Text } from "@/ui";
import { useControllable } from "@dreamy-ui/react";

function LoremIpsum({ p = 1 }: { p?: number }) {
    const lorem =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return <Text>{lorem.repeat(p)}</Text>;
}

export function BasicDrawer() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant={"primary"}
                w="fit-content"
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

export function VariantDrawers() {
    const variants = ["inset", "simple"] as const;

    function DrawerVariant({ variant }: { variant: (typeof variants)[number] }) {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant={"primary"}
                    w="fit-content"
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
                            {variant === "inset"
                                ? "Inset floats with spacing from the viewport and rounded corners."
                                : "Simple sits flush against the viewport edge with no rounding."}
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
        <Flex
            gap={2}
            wrapped
        >
            {variants.map((variant) => (
                <DrawerVariant
                    key={"drawer-variant-" + variant}
                    variant={variant}
                />
            ))}
        </Flex>
    );
}

export function PlacementDrawers() {
    const placements = ["right", "left", "top", "bottom"] as const;

    function DrawerPlacement({ placement }: { placement: (typeof placements)[number] }) {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant={"primary"}
                    w="fit-content"
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
                    key={"drawer-placement-" + placement}
                    placement={placement}
                />
            ))}
        </Flex>
    );
}

export function SizeDrawers() {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "full"] as const;

    function DrawerSize({ size }: { size: (typeof sizes)[number] }) {
        const { isOpen, onClose, onOpen } = useControllable();

        return (
            <>
                <Button
                    onClick={onOpen}
                    variant={"primary"}
                    w="fit-content"
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
                        <Drawer.Body>This is a {size} drawer!</Drawer.Body>
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
                    key={"drawer-size-" + size}
                    size={size}
                />
            ))}
        </Flex>
    );
}

export function ScrollableInsideDrawer() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant={"primary"}
                w="fit-content"
            >
                Open Drawer
            </Button>

            <Drawer.Root
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
                size={"lg"}
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Drawer Header</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>
                        {[...Array(12)].map((_, i) => (
                            <LoremIpsum
                                key={`ipsum-inside-${i}`}
                                p={1}
                            />
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
