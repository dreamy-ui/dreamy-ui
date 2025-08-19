import { PinInput, PinInputField } from "@/pin-input";
import { useState } from "react";

export function ControlledPinInput() {
    const [pin, setPin] = useState("69");

    return (
        <PinInput
            value={pin}
            onChange={setPin}
        >
            <PinInputField />
            <PinInputField />
            <PinInputField />
        </PinInput>
    );
}
