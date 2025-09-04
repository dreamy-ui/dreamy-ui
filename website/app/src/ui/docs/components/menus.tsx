import { Button } from "@/button";
import { Flex } from "@/flex";
import { Menu } from "@/menu";
import { Text } from "@/text";
import { getActionKeyCode, useControllable, useEventListener } from "@dreamy-ui/react";
import { IoAdd } from "react-icons/io5";
import { LuAlarmClock, LuBattery, LuTrash, LuWarehouse } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

export function ControlledMenu() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <Menu.Root
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        >
            <Text>{isOpen ? "Open" : "Closed"}</Text>
            <Menu.Trigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </Menu.Trigger>
            <Menu.Content>
                <Menu.Item
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </Menu.Item>
                <Menu.Item
                    icon={<IoAdd />}
                    command="{actionKey} n"
                >
                    Add new
                </Menu.Item>
                <Menu.Item
                    icon={<LuAlarmClock />}
                    command="{actionKey} a"
                >
                    Set alarm
                </Menu.Item>
                <Menu.Item
                    icon={<LuBattery />}
                    command="{actionKey} b"
                >
                    Battery
                </Menu.Item>
                <Menu.Item
                    icon={<LuTrash />}
                    command="{actionKey} d"
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
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </Menu.Item>
                <Menu.Item
                    icon={<IoAdd />}
                    command="{actionKey} n"
                >
                    Add new
                </Menu.Item>
                <Menu.Item
                    icon={<LuAlarmClock />}
                    command="{actionKey} a"
                >
                    Set alarm
                </Menu.Item>
                <Menu.Item
                    icon={<LuBattery />}
                    command="{actionKey} b"
                >
                    Battery
                </Menu.Item>
                <Menu.Item
                    icon={<LuTrash />}
                    command="{actionKey} d"
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
            wrapped
            gap={5}
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
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </Menu.Item>
                <Menu.Item
                    icon={<IoAdd />}
                    command="{actionKey} n"
                >
                    Add new
                </Menu.Item>
                <Menu.Item
                    icon={<LuAlarmClock />}
                    command="{actionKey} a"
                >
                    Set alarm
                </Menu.Item>
                <Menu.Item
                    icon={<LuBattery />}
                    command="{actionKey} b"
                >
                    Battery
                </Menu.Item>
                <Menu.Item
                    icon={<LuTrash />}
                    command="{actionKey} d"
                >
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu.Root>
    );
}
