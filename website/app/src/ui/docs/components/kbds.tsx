import { Kbd } from "@/kbd";
import { useActionKey } from "@dreamy-ui/react";

export function PlatformSpecificKbd() {
    const actionKey = useActionKey();

    return <Kbd>{actionKey} + K</Kbd>;
}
