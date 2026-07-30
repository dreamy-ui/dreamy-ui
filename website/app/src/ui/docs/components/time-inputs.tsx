"use client";

import { Text, TimeInput, VStack } from "@/ui";
import { useState } from "react";

export function ControlledTimeInput() {
    const [value, setValue] = useState("14:30");

    return (
        <VStack alignItems="flex-start">
            <Text fontSize="sm">Value: {value || "(empty)"}</Text>
            <TimeInput.AIO
                hour12
                onChange={setValue}
                value={value}
            />
        </VStack>
    );
}
