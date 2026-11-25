"use client";

import { Text, TimeInput, VStack } from "@/ui";
import { useState } from "react";

export function ControlledTimeInput() {
    const [value, setValue] = useState<string | null>("14:30");

    return (
        <VStack alignItems="flex-start">
            <Text fontSize="sm">Value: {value || "(empty)"}</Text>
            <TimeInput.AIO
                hourCycle={12}
                onValueChange={(next) => setValue(next)}
                value={value}
            />
        </VStack>
    );
}
