import { Button, Menu } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { IoAdd } from "react-icons/io5";
import { LuAlarmClock, LuBattery, LuTrash } from "react-icons/lu";

export default {
    title: "Menu"
} satisfies Meta;

export function Base() {
    return (
        <Menu.Root>
            <Menu.Trigger>
                <Button w="fit-content">Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    command="{actionKey} n"
                    icon={<IoAdd />}
                >
                    Add new
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} a"
                    icon={<LuAlarmClock />}
                >
                    Set alarm
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} b"
                    icon={<LuBattery />}
                >
                    Battery
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} d"
                    icon={<LuTrash />}
                >
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu.Root>
    );
}

export function Placement() {
    return (
        <Menu.Root placement="bottom-start">
            <Menu.Trigger>
                <Button w="fit-content">Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    command="{actionKey} n"
                    icon={<IoAdd />}
                >
                    Add new
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} a"
                    icon={<LuAlarmClock />}
                >
                    Set alarm
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} b"
                    icon={<LuBattery />}
                >
                    Battery
                </Menu.Item>
                <Menu.Item
                    command="{actionKey} d"
                    icon={<LuTrash />}
                >
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu.Root>
    );
}

export function Sizes() {
    return (
        <>
            {["xs", "sm", "md", "lg"].map((size) => (
                <Menu.Root
                    key={size}
                    size={size as any}
                >
                    <Menu.Trigger>
                        <Button w="fit-content">Open {size} Menu</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                        <Menu.Item
                            command="{actionKey} n"
                            icon={<IoAdd />}
                        >
                            Add new
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} a"
                            icon={<LuAlarmClock />}
                        >
                            Set alarm
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} b"
                            icon={<LuBattery />}
                        >
                            Battery
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} d"
                            icon={<LuTrash />}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Root>
            ))}
        </>
    );
}

export function Variants() {
    return (
        <>
            {(["plain", "stretched"] as const).map((variant) => (
                <Menu.Root
                    key={variant}
                    variant={variant}
                >
                    <Menu.Trigger>
                        <Button w="fit-content">Open {variant} Menu</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                        <Menu.Item
                            command="{actionKey} n"
                            icon={<IoAdd />}
                        >
                            Add new
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} a"
                            icon={<LuAlarmClock />}
                        >
                            Set alarm
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} b"
                            icon={<LuBattery />}
                        >
                            Battery
                        </Menu.Item>
                        <Menu.Item
                            command="{actionKey} d"
                            icon={<LuTrash />}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Root>
            ))}
        </>
    );
}
