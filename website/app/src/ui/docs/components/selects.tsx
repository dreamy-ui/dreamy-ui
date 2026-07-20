import { Button, HStack, Modal, Select, Spinner, Text } from "@/ui";
import { useControllable } from "@dreamy-ui/react";
import { useState } from "react";
import { LuBanana, LuCherry, LuCitrus } from "react-icons/lu";

const fruits = [
    { value: "cherry", label: "Cherry", icon: <LuCherry /> },
    { value: "banana", label: "Banana", icon: <LuBanana /> },
    { value: "orange", label: "Orange", icon: <LuCitrus /> }
];

export function ItemsSelect() {
    return (
        <Select.Root
            items={fruits}
            renderItem={(item) => (
                <HStack gap={2}>
                    {item.icon}
                    <Text>{item.label}</Text>
                </HStack>
            )}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function SelectInModal() {
    const { isOpen, onOpen, onClose } = useControllable();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="primary"
                w="fit-content"
            >
                Open modal
            </Button>
            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Select in a modal</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <Select.Root
                            defaultValue="cherry"
                            items={fruits}
                            width="xs"
                        >
                            <Select.Trigger placeholder="Select a favorite fruit" />
                            <Select.Content />
                        </Select.Root>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

export function AsyncSelect() {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<{ value: string; label: string }[]>([]);

    function fetchFruits() {
        if (items.length > 0) return;

        setIsLoading(true);
        fetch("/api/fake-select-data")
            .then((res) => res.json())
            .then((data: string[]) =>
                setItems(data.map((fruit) => ({ value: fruit, label: fruit })))
            )
            .finally(() => setIsLoading(false));
    }

    return (
        <Select.Root
            items={items}
            onOpen={fetchFruits}
            width={"xs"}
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content showItems={!isLoading}>
                <Spinner
                    color="primary"
                    py={4}
                />
            </Select.Content>
        </Select.Root>
    );
}

export function ControlledSelect() {
    const [value, setValue] = useState<string>("strawberry");

    const fruits = [
        { value: "strawberry", label: "Strawberry" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" }
    ];

    return (
        <Select.Root
            items={fruits}
            onChangeValue={setValue}
            value={value}
            width={"xs"}
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}
