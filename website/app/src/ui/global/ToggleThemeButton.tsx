import { Icon } from "@/ui";
import { IconButton } from "@/ui";
import { Tooltip } from "@/ui";
import { getActionKeyCode, useActionKey, useColorMode, useEventListener } from "@dreamy-ui/react";
import { BiMoon, BiSun } from "react-icons/bi";
import { useRouteLoaderData } from "react-router";
import type { loader } from "~/root";

export function ToggleThemeButton() {
    const { toggleColorMode, colorMode } = useColorMode();

    // toggle theme on cmd + i
    useEventListener("keydown", (event) => {
        if (event.key === "i" && event[getActionKeyCode()] && !event.shiftKey) {
            toggleColorMode();
        }
    });

    const rootData = useRouteLoaderData<typeof loader>("root");
    const actionKey = useActionKey(rootData?.isMac ? "⌘" : "Ctrl", (isMac) => {
        document.cookie = `isMac=${isMac}; path=/`;
    });

    return (
        <Tooltip
            content={`${actionKey} i`}
            disablePortal
            openDelay={500}
        >
            <IconButton
                aria-label="Toggle color mode"
                data-umami-event="Toggle Theme"
                icon={<Icon as={colorMode === "light" ? BiMoon : BiSun} />}
                onClick={toggleColorMode}
                variant={"ghost"}
            />
        </Tooltip>
    );
}
