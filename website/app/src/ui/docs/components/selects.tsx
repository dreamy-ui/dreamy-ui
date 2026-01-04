import { Select } from "@/ui";
import { Spinner } from "@/ui";
import { useState } from "react";

export function AsyncSelect() {
    const [isLoading, setIsLoading] = useState(true);
    const [fruits, setFruits] = useState<string[]>([]);

    function fetchFruits() {
        if (fruits.length > 0) return;

        fetch("/api/fake-select-data")
            .then((res) => res.json())
            .then(setFruits)
            .finally(() => setIsLoading(false));
    }

    return (
        <Select.Root
            onOpen={fetchFruits}
            width={"xs"}
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                {isLoading && (
                    <Spinner
                        color="primary"
                        py={4}
                    />
                )}
                {fruits.map((fruit) => (
                    <Select.Item
                        key={fruit}
                        value={fruit}
                    >
                        {fruit}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}

export function ControlledSelect() {
    const [value, setValue] = useState<string>("strawberry");

    return (
        <Select.Root
            onChangeValue={setValue}
            value={value}
            width={"xs"}
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="strawberry">Strawberry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}
