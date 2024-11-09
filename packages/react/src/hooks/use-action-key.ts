import { useSafeLayoutEffect } from "@/components/descendant/utils";
import { useState } from "react";

type ActionKey = "Ctrl" | "⌘";

/**
 * React hook that returns the action key based on the platform to be displayed in the UI.
 * @param initial The initial action key to use. Defaults to "Ctrl".
 * @param cb Optional callback that receives a boolean indicating if the platform is Mac.
 */
export function useActionKey(
    initial: ActionKey = "Ctrl",
    cb?: (isMac: boolean) => void
): ActionKey {
    const [actionKey, setActionKey] = useState(initial);

    useSafeLayoutEffect(() => {
        if (typeof navigator === "undefined") return;
        const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
        if (isMac) {
            setActionKey("⌘");
        }

        cb?.(isMac);
    }, []);

    return actionKey;
}

/**
 * Get the action key code based on the platform. Useful for integrating with keyboard events.
 * eg. in a keyboard event handler, you can check if the action key is pressed using `event[getActionKeyCode()]`
 * @returns "metaKey" for Mac and "ctrlKey" for other platforms.
 */
export function getActionKeyCode() {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform);
    return isMac ? "metaKey" : "ctrlKey";
}
