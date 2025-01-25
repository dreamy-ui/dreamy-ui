import { useState } from "react";

import { PinInput, PinInputField } from "@dreamy-ui/react";

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
