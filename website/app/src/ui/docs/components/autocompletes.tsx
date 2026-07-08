import { Autocomplete, type AutocompleteItem, Spinner, Text, VStack } from "@/ui";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";

const fruits: AutocompleteItem[] = [
    { value: "strawberry", label: "Strawberry" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" }
];

export function ControlledAutocomplete() {
    const [value, setValue] = useState<string | null>(null);

    return (
        <VStack
            align="start"
            gap={2}
        >
            <Text>Selected: {value ?? "none"}</Text>
            <Autocomplete.Root
                items={fruits}
                onChangeValue={setValue}
                value={value}
                width="xs"
            >
                <Autocomplete.Input placeholder="Search a fruit..." />
                <Autocomplete.Content />
            </Autocomplete.Root>
        </VStack>
    );
}

export function AutocompleteWithIcon() {
    return (
        <Autocomplete.Root
            items={fruits}
            width="xs"
        >
            <Autocomplete.Input
                icon={<LuSearch />}
                placeholder="Search a fruit..."
            />
            <Autocomplete.Content />
        </Autocomplete.Root>
    );
}

export function AsyncSearchAutocomplete() {
    const [value, setValue] = useState("");
    const [items, setItems] = useState<AutocompleteItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!value) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timeoutId = setTimeout(() => {
            fetch("/api/fake-select-data")
                .then((res) => res.json())
                .then((data: string[]) => {
                    setItems(
                        data
                            .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
                            .map((item) => ({
                                value: item,
                                label: item.charAt(0).toUpperCase() + item.slice(1)
                            }))
                    );
                })
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    return (
        <VStack
            align="start"
            gap={2}
        >
            <Text>Query: {value || "none"}</Text>
            <Autocomplete.Root
                filterFn={() => true}
                items={items}
                width="xs"
            >
                <Autocomplete.Input
                    onChangeValue={setValue}
                    placeholder="Search fruits..."
                />
                <Autocomplete.Content
                    noResultsContent={
                        isLoading ? (
                            <Spinner
                                color="primary"
                                py={4}
                            />
                        ) : value ? undefined : (
                            <Text
                                color="fg.medium"
                                px={3}
                                py={2}
                            >
                                Type to search...
                            </Text>
                        )
                    }
                    noResultsText="No fruits found"
                />
            </Autocomplete.Root>
        </VStack>
    );
}

export function AsyncAutocomplete() {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<AutocompleteItem[]>([]);

    function fetchItems() {
        if (items.length > 0) return;

        fetch("/api/fake-select-data")
            .then((res) => res.json())
            .then((data: string[]) =>
                setItems(
                    data.map((s) => ({
                        value: s,
                        label: s.charAt(0).toUpperCase() + s.slice(1)
                    }))
                )
            )
            .finally(() => setIsLoading(false));
    }

    return (
        <Autocomplete.Root
            items={items}
            onOpen={fetchItems}
            width="xs"
        >
            <Autocomplete.Input placeholder="Search a fruit..." />
            <Autocomplete.Content
                noResultsContent={
                    isLoading ? (
                        <Spinner
                            color="primary"
                            py={4}
                        />
                    ) : undefined
                }
            />
        </Autocomplete.Root>
    );
}

const manyItems: AutocompleteItem[] = Array.from({ length: 1000 }, (_, i) => ({
    value: `item-${i}`,
    label: `Item ${i + 1}`
}));

export function VirtualAutocomplete() {
    return (
        <Autocomplete.Root
            items={manyItems}
            width="xs"
        >
            <Autocomplete.Input placeholder="Search items..." />
            <Autocomplete.VirtualContent />
        </Autocomplete.Root>
    );
}

function useDebouncedEffect(effect: () => void, dependencies: any[], delay: number) {
    useEffect(() => {
        const timer = setTimeout(() => {
            effect();
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [...dependencies]);
}

export function StationAutocomplete() {
    const [value, setValue] = useState("");
    const [raw, setRaw] = useState("");
    const [items, setItems] = useState<any[]>([]);

    useDebouncedEffect(
        async () => {
            if (!raw) {
                return;
            }

            const data = [
                {
                    value: "Station1",
                    label: "Station 1"
                },
                {
                    value: "Station2",
                    label: "Station 2"
                },
                {
                    value: "Station2",
                    label: "Station 2"
                }
            ];

            setItems(data);
        },
        [raw],
        200
    );

    return (
        <>
            <HStack>
                <Text>Input: {raw}</Text>
                <Text>Value: {value}</Text>
            </HStack>
            <Autocomplete.Root
                filterFn={(item, query) => true}
                items={items}
                onChangeValue={setValue}
                size={"lg"}
                value={value}
            >
                <Autocomplete.Input
                    onChangeValue={setRaw}
                    placeholder="Enter station name..."
                    value={raw}
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        </>
    );
}
