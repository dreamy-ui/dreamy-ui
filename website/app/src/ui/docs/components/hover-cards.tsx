"use client";

import { Avatar, Button, HStack, HoverCard, Text, VStack } from "@/ui";
import { useState } from "react";

export function ControlledHoverCard() {
    const [open, setOpen] = useState(false);

    return (
        <VStack
            align="flex-start"
            gap={4}
        >
            <Button
                onClick={() => setOpen(!open)}
                size="sm"
                variant="outline"
            >
                {open ? "Close" : "Open"} hover card
            </Button>
            <HoverCard.Root
                open={open}
                onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
            >
                <HoverCard.Trigger>
                    <Button variant="link">@dreamy_ui</Button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>
                        <HStack
                            align="flex-start"
                            gap={3}
                        >
                            <Avatar
                                flexShrink={0}
                                name="Dreamy UI"
                                rounded="none"
                                size="sm"
                                src="/dreamy-ui-no-bg.png"
                            />
                            <VStack
                                align="flex-start"
                                gap={1}
                            >
                                <Text fontWeight="semibold">Dreamy UI</Text>
                                <Text
                                    color="fg.medium"
                                    fontSize="sm"
                                >
                                    A beautiful React component library with smooth animations.
                                </Text>
                            </VStack>
                        </HStack>
                    </HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        </VStack>
    );
}
