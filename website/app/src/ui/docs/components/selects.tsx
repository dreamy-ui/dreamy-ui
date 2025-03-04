import { Select, SelectContent, SelectItem, SelectTrigger } from "@dreamy-ui/react";
import { Spinner } from "@dreamy-ui/react/rsc";
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
        <Select
            onOpen={fetchFruits}
            width={"xs"}
        >
            <SelectTrigger placeholder="Select a favorite fruit" />
            <SelectContent>
                {isLoading && (
                    <Spinner
                        color="primary"
                        py={4}
                    />
                )}
                {fruits.map((fruit) => (
                    <SelectItem
                        key={fruit}
                        value={fruit}
                    >
                        {fruit}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function ControlledSelect() {
    const [value, setValue] = useState<string>("strawberry");

    return (
        <Select
            value={value}
            onChangeValue={setValue}
            width={"xs"}
        >
            <SelectTrigger placeholder="Select a favorite fruit" />
            <SelectContent>
                <SelectItem value="strawberry">Strawberry</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
        </Select>
    );
}
