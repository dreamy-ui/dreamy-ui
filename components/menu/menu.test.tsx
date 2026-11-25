import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Menu from "./index";

describe("Menu", () => {
    it("exposes menu button and menu semantics per APG", async () => {
        const user = userEvent.setup();

        render(
            <Menu.Root>
                <Menu.Trigger>
                    <button type="button">Open menu</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item>Add new</Menu.Item>
                    <Menu.Item>Set alarm</Menu.Item>
                    <Menu.Item disabled>Disabled</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Open menu" });

        expect(trigger).toHaveAttribute("data-slot", "menu-trigger");
        expect(trigger).toHaveAttribute("aria-haspopup", "menu");
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        await user.click(trigger);

        const menu = await screen.findByRole("menu");
        expect(menu).toHaveAttribute("data-slot", "menu-content");
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        const controls = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        expect(document.getElementById(controls!)).toBe(menu);

        const items = within(menu).getAllByRole("menuitem");
        expect(items).toHaveLength(3);
        expect(items[2]).toHaveAttribute("aria-disabled", "true");
        expect(items[2]).toHaveAttribute("data-disabled", "");
    });

    it("navigates items with ArrowDown / ArrowUp and activates with Enter", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();
        const onAlarm = vi.fn();
        const onAction = vi.fn();

        render(
            <Menu.Root onAction={onAction}>
                <Menu.Trigger>
                    <button type="button">Actions</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item
                        onSelect={onAdd}
                        value="add"
                    >
                        Add new
                    </Menu.Item>
                    <Menu.Item
                        onSelect={onAlarm}
                        value="alarm"
                    >
                        Set alarm
                    </Menu.Item>
                    <Menu.Item value="battery">Battery</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Actions" });
        trigger.focus();
        await user.keyboard("{ArrowDown}");

        await screen.findByRole("menu");
        const addItem = screen.getByRole("menuitem", { name: "Add new" });
        const alarmItem = screen.getByRole("menuitem", { name: "Set alarm" });

        await waitFor(() => {
            expect(addItem).toHaveFocus();
        });

        await user.keyboard("{ArrowDown}");
        await waitFor(() => {
            expect(alarmItem).toHaveFocus();
        });

        await user.keyboard("{ArrowUp}");
        await waitFor(() => {
            expect(addItem).toHaveFocus();
        });

        await user.keyboard("{Enter}");
        expect(onAdd).toHaveBeenCalled();
        expect(onAction).toHaveBeenCalledWith("add", expect.anything());
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Menu.Root onOpenChange={onOpenChange}>
                <Menu.Trigger>
                    <button type="button">Menu</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item>One</Menu.Item>
                    <Menu.Item>Two</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Menu" });
        await user.click(trigger);
        await screen.findByRole("menu");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(
                false,
                expect.objectContaining({ reason: "escape-key" })
            );
        });
        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
        await waitFor(() => {
            expect(trigger).toHaveFocus();
        });
    });

    it("supports positioning and closes after item activation by default", async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(
            <Menu.Root positioning={{ placement: "bottom-start" }}>
                <Menu.Trigger>
                    <button type="button">Placed menu</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item onSelect={onSelect}>Choose me</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Placed menu" });
        await user.click(trigger);
        await screen.findByRole("menu");
        await user.click(screen.getByRole("menuitem", { name: "Choose me" }));

        expect(onSelect).toHaveBeenCalled();
        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("opens nested submenu content with TriggerItem", async () => {
        const user = userEvent.setup();

        render(
            <Menu.Root>
                <Menu.Trigger>
                    <button type="button">Root menu</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item>Top</Menu.Item>
                    <Menu.TriggerItem label="More">
                        <Menu.Content>
                            <Menu.Item>Nested one</Menu.Item>
                            <Menu.Item>Nested two</Menu.Item>
                        </Menu.Content>
                    </Menu.TriggerItem>
                </Menu.Content>
            </Menu.Root>
        );

        await user.click(screen.getByRole("button", { name: "Root menu" }));
        await screen.findByRole("menu");

        const submenuTrigger = screen.getByRole("menuitem", { name: /More/ });
        await user.click(submenuTrigger);

        await waitFor(() => {
            expect(screen.getByRole("menuitem", { name: "Nested one" })).toBeInTheDocument();
        });
    });
});
