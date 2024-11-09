import { useActionKey } from "@dreamy-ui/react";
import { Kbd } from "@dreamy-ui/react/rsc";

export function PlatformSpecificKbd() {
    const actionKey = useActionKey();

    return <Kbd>{actionKey} + K</Kbd>;
}
