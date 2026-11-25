import { Box, Button, Flex, Text } from "@/ui";
import { useCallback, useState } from "react";

export function useDemoLog(maxEntries = 6) {
    const [entries, setEntries] = useState<string[]>([]);

    const log = useCallback(
        (message: string) => {
            setEntries((prev) => [message, ...prev].slice(0, maxEntries));
        },
        [maxEntries]
    );

    const clear = useCallback(() => {
        setEntries([]);
    }, []);

    return { entries, log, clear };
}

export interface DemoLogProps {
    entries: string[];
    onClear?: () => void;
    emptyText?: string;
}

export function DemoLog({
    entries,
    onClear,
    emptyText = "Interact with the demo to see events."
}: DemoLogProps) {
    return (
        <Box
            bg="alpha.50"
            border="1px solid"
            borderColor="border"
            p={3}
            rounded="l2"
            w="full"
        >
            <Flex
                align="center"
                justify="space-between"
                mb={entries.length > 0 ? 2 : 0}
            >
                <Text
                    color="fg.medium"
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="wider"
                    textTransform="uppercase"
                >
                    Event Log
                </Text>
                {entries.length > 0 && onClear ? (
                    <Button
                        onClick={onClear}
                        size="xs"
                        variant="ghost"
                    >
                        Clear
                    </Button>
                ) : null}
            </Flex>
            {entries.length === 0 ? (
                <Text
                    color="fg.medium"
                    fontSize="xs"
                >
                    {emptyText}
                </Text>
            ) : (
                <Flex
                    col
                    gap={1}
                >
                    {entries.map((entry, index) => (
                        <Text
                            color="fg"
                            fontFamily="mono"
                            fontSize="xs"
                            key={`${index}-${entry}`}
                        >
                            {entry}
                        </Text>
                    ))}
                </Flex>
            )}
        </Box>
    );
}
