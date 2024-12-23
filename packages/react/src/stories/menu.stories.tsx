import { Button, Menu, MenuContent, MenuItem, MenuTrigger } from "@/components";
import type { Meta } from "@storybook/react";
import { IoAdd } from "react-icons/io5";
import { LuAlarmClock, LuBattery, LuTrash } from "react-icons/lu";

export default {
    title: "Menu"
} satisfies Meta;

export function Base() {
    return (
        <Menu>
            <MenuTrigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem
                    icon={<IoAdd />}
                    command="{actionKey} n"
                >
                    Add new
                </MenuItem>
                <MenuItem
                    icon={<LuAlarmClock />}
                    command="{actionKey} a"
                >
                    Set alarm
                </MenuItem>
                <MenuItem
                    icon={<LuBattery />}
                    command="{actionKey} b"
                >
                    Battery
                </MenuItem>
                <MenuItem
                    icon={<LuTrash />}
                    command="{actionKey} d"
                >
                    Delete
                </MenuItem>
            </MenuContent>
        </Menu>
    );
}

export function Size() {
    return (
        <>
            <Menu size="xs">
                <MenuTrigger>
                    <Button w={"fit-content"}>Open Menu</Button>
                </MenuTrigger>
                <MenuContent>
                    <MenuItem
                        icon={<IoAdd />}
                        command="{actionKey} n"
                    >
                        Add new
                    </MenuItem>
                    <MenuItem
                        icon={<LuAlarmClock />}
                        command="{actionKey} a"
                    >
                        Set alarm
                    </MenuItem>
                    <MenuItem
                        icon={<LuBattery />}
                        command="{actionKey} b"
                    >
                        Battery
                    </MenuItem>
                    <MenuItem
                        icon={<LuTrash />}
                        command="{actionKey} d"
                    >
                        Delete
                    </MenuItem>
                </MenuContent>
            </Menu>
        </>
    );
}
