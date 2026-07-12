import { Box, Button, Flex, HStack } from "@/ui";
import { useToast } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Toast"
} satisfies Meta;

export function Base() {
    const { toast } = useToast();

    return (
        <Button
            onClick={() =>
                toast({
                    title: "Welcome!",
                    description: "Make yourself at home!"
                })
            }
        >
            Toast
        </Button>
    );
}

export function Status() {
    const { toast } = useToast();

    return (
        <Flex
            gap={2}
            wrapped
        >
            {(["success", "error", "warning", "info", "loading"] as const).map((status) => (
                <Button
                    key={status}
                    onClick={() =>
                        toast({
                            title: status + "!",
                            description: `This is a ${status} toast!`,
                            status
                        })
                    }
                >
                    {status}
                </Button>
            ))}
        </Flex>
    );
}

export function Position() {
    const { toast } = useToast();

    return (
        <Flex
            gap={2}
            wrapped
        >
            {(
                ["top-left", "top", "top-right", "bottom-left", "bottom", "bottom-right"] as const
            ).map((position) => (
                <Button
                    key={position}
                    onClick={() =>
                        toast({
                            title: position,
                            description: `This toast is at ${position}!`,
                            position
                        })
                    }
                >
                    {position}
                </Button>
            ))}
        </Flex>
    );
}

export function Duration() {
    const { toast } = useToast();

    return (
        <HStack>
            <Button
                onClick={() =>
                    toast({
                        title: "This toast lasts 10 seconds!",
                        duration: 10_000
                    })
                }
            >
                10 seconds
            </Button>
            <Button
                onClick={() =>
                    toast({
                        title: "This toast lasts forever!",
                        description: "To close this toast, you need to click the close button.",
                        duration: Number.POSITIVE_INFINITY,
                        isClosable: true
                    })
                }
            >
                Infinite
            </Button>
        </HStack>
    );
}

export function Closable() {
    const { toast } = useToast();

    return (
        <Button
            onClick={() =>
                toast({
                    title: "Closable",
                    description: "This toast is closable!",
                    isClosable: true
                })
            }
        >
            Closable
        </Button>
    );
}

export function RightContent() {
    const { toast } = useToast();

    return (
        <Button
            onClick={() =>
                toast({
                    title: "Right content",
                    description: "This toast has a right content!",
                    rightContent: (
                        <Button
                            size="sm"
                            variant="outline"
                        >
                            Okay
                        </Button>
                    )
                })
            }
        >
            Right content
        </Button>
    );
}

export function CustomRender() {
    const { toast } = useToast();

    return (
        <Button
            onClick={() =>
                toast({
                    title: "This toast is custom!",
                    render: () => (
                        <Box
                            bg="primary"
                            p={4}
                            rounded="l2"
                        >
                            This is a custom toast!
                        </Box>
                    )
                })
            }
        >
            Custom Render
        </Button>
    );
}

export function UpdateToast() {
    const { toast, updateToast } = useToast();
    const [toastId, setToastId] = useState<string | null>(null);

    return (
        <HStack>
            <Button
                onClick={() => {
                    setToastId(
                        toast({
                            title: "Loading",
                            description: "Please wait till file is uploaded!",
                            status: "loading",
                            duration: Number.POSITIVE_INFINITY
                        })
                    );
                }}
            >
                Send Toast
            </Button>
            <Button
                onClick={() => {
                    if (toastId) {
                        updateToast(toastId, {
                            title: "Success!",
                            description: "File uploaded successfully!",
                            status: "success"
                        });
                    }
                }}
            >
                Update Toast
            </Button>
        </HStack>
    );
}
