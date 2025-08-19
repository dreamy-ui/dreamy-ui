import { Switch } from "@/switch";
import { Text } from "@/text";
import { useState } from "react";

export function ControlledSwitch() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Switch
                isChecked={isChecked}
                onChangeValue={setIsChecked}
            >
                Controlled
            </Switch>
        </>
    );
}
