import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Menu } from "@/ui";
import { Text } from "@/ui";
import { getActionKeyCode, useControllable, useEventListener } from "@dreamy-ui/react";
import { IoAdd } from "react-icons/io5";
import { LuAlarmClock, LuBattery, LuTrash, LuWarehouse } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

export function ControlledMenu() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <Menu.Root
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
        >
            <Text>{isOpen ? "Open" : "Closed"}</Text>
            <Menu.Trigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    as={<Link to="/" />}
                    command="{actionKey} h"
                    icon={<LuWarehouse />}
                >
                    Homepage
                </Menu.Item>
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

export function InteractiveMenu() {
    const navigate = useNavigate();

    useEventListener("keydown", (event) => {
        if (!event[getActionKeyCode()]) return; // Making sure the ctrl/cmd key is pressed

        switch (event.key) {
            case "h": {
                event.preventDefault();
                navigate("/");
                alert("Homepage");
                break;
            }
            case "n": {
                event.preventDefault();
                alert("New");
                break;
            }
            case "a": {
                event.preventDefault();
                alert("Alarm");
                break;
            }
            case "b": {
                event.preventDefault();
                alert("Battery");
                break;
            }
            case "d": {
                event.preventDefault();
                alert("Delete");
                break;
            }
        }
    });

    return (
        <Menu.Root>
            <Menu.Trigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    as={<Link to="/" />}
                    command="{actionKey} h"
                    icon={<LuWarehouse />}
                >
                    Homepage
                </Menu.Item>
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

export function VariantMenus() {
    return (
        <Flex
            gap={5}
            wrapped
        >
            {["plain", "stretched"].map((variant) => (
                <VariantMenu
                    key={variant}
                    variant={variant}
                />
            ))}
        </Flex>
    );
}

export function VariantMenu({ variant }: { variant: string }) {
    return (
        <Menu.Root variant={variant as any}>
            <Menu.Trigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    as={<Link to="/" />}
                    command="{actionKey} h"
                    icon={<LuWarehouse />}
                >
                    Homepage
                </Menu.Item>
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
