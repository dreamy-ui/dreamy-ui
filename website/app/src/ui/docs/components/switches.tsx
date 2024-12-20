import { Switch } from "@dreamy-ui/react";
import { Text } from "@dreamy-ui/react/rsc";
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
