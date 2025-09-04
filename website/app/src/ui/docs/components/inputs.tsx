import { PinInput } from "@/pin-input";
import { useState } from "react";

export function ControlledPinInput() {
    const [pin, setPin] = useState("2137");

    return (
        <PinInput.Root
            value={pin}
            onChange={setPin}
        >
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
            <PinInput.Field />
        </PinInput.Root>
    );
}
