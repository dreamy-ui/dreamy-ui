import { PinInput } from "@/ui";
import { useState } from "react";

export function ControlledPinInput() {
    const [pin, setPin] = useState("2137");

    return (
        <PinInput.Root
            onChange={setPin}
            value={pin}
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}
