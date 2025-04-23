import {
    Button,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    getActionKeyCode,
    useControllable,
    useEventListener
} from "@dreamy-ui/react";
import { Flex, Text } from "@dreamy-ui/react/rsc";
import { Link, useNavigate } from "@remix-run/react";
import { IoAdd } from "react-icons/io5";
import { LuAlarmClock, LuBattery, LuTrash, LuWarehouse } from "react-icons/lu";

export function ControlledMenu() {
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <Menu
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        >
            <Text>{isOpen ? "Open" : "Closed"}</Text>
            <MenuTrigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </MenuItem>
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
        <Menu>
            <MenuTrigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </MenuItem>
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

export function VariantMenus() {
    return (
        <Flex
            wrapped
            gap={5}
        >
            {(
                ["plain", "stretched"]
            ).map((variant) => (
                <VariantMenu key={variant} variant={variant} />
            ))}
        </Flex>
    );
}

export function VariantMenu({ variant }: { variant: string }) {
    return (
        <Menu variant={variant as any}>
            <MenuTrigger>
                <Button w={"fit-content"}>Open Menu</Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem
                    icon={<LuWarehouse />}
                    command="{actionKey} h"
                    asComp={<Link to="/" />}
                >
                    Homepage
                </MenuItem>
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