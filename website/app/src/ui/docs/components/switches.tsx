import { Switch } from "@/ui";
import { Text } from "@/ui";
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
