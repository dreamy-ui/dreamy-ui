import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Menu from "./index";

function getMenuSurface() {
    return document.body.querySelector(".menu__content") as HTMLElement | null;
}

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

        expect(trigger).toHaveAttribute("aria-haspopup", "menu");
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        await user.click(trigger);

        const menu = await screen.findByRole("menu");
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        const controls = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        expect(document.getElementById(controls!)).toBe(menu);

        const items = within(menu).getAllByRole("menuitem");
        expect(items).toHaveLength(3);
        expect(items[2]).toBeDisabled();
    });

    it("navigates items with ArrowDown / ArrowUp and activates with Enter", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();
        const onAlarm = vi.fn();

        render(
            <Menu.Root>
                <Menu.Trigger>
                    <button type="button">Actions</button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Item onClick={onAdd}>Add new</Menu.Item>
                    <Menu.Item onClick={onAlarm}>Set alarm</Menu.Item>
                    <Menu.Item>Battery</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Actions" });
        await user.click(trigger);
        await waitFor(() => {
            expect(getMenuSurface()).toBeTruthy();
        });

        await user.keyboard("{ArrowDown}");
        await waitFor(() => {
            expect(screen.getByRole("menuitem", { name: "Add new" })).toHaveAttribute(
                "data-focused"
            );
        });

        await user.keyboard("{ArrowDown}");
        await waitFor(() => {
            expect(screen.getByRole("menuitem", { name: "Set alarm" })).toHaveAttribute(
                "data-focused"
            );
        });

        await user.keyboard("{ArrowUp}");
        await waitFor(() => {
            expect(screen.getByRole("menuitem", { name: "Add new" })).toHaveAttribute(
                "data-focused"
            );
        });

        await user.keyboard("{Enter}");
        expect(onAdd).toHaveBeenCalled();
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <Menu.Root onClose={onClose}>
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
        await waitFor(() => {
            expect(getMenuSurface()).toBeTruthy();
        });

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
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
                    <Menu.Item onClick={onSelect}>Choose me</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        );

        const trigger = screen.getByRole("button", { name: "Placed menu" });
        await user.click(trigger);
        await waitFor(() => {
            expect(getMenuSurface()).toBeTruthy();
        });
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
        await waitFor(() => {
            expect(getMenuSurface()).toBeTruthy();
        });

        const submenuTrigger = screen.getByRole("menuitem", { name: /More/ });
        await user.click(submenuTrigger);

        await waitFor(() => {
            expect(screen.getByRole("menuitem", { name: "Nested one" })).toBeInTheDocument();
        });
    });
});
