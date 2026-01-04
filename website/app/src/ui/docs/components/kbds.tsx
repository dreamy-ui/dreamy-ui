import { Kbd } from "@/ui";
import { useActionKey } from "@dreamy-ui/react";

export function PlatformSpecificKbd() {
    const actionKey = useActionKey();

    return <Kbd>{actionKey} + K</Kbd>;
}
