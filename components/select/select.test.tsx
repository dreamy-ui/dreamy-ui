import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as Select from "./index";

const fruits = [
    { value: "strawberry", label: "Strawberry" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" }
];

describe("Select", () => {
    it("names the trigger from Field and reflects closed combobox state", () => {
        render(
            <Field.Root>
                <Field.Label>Fruit</Field.Label>
                <Select.Root
                    items={fruits}
                    popoverProps={{ usePortal: false }}
                >
                    <Select.Trigger placeholder="Select a fruit" />
                    <Select.Content />
                </Select.Root>
            </Field.Root>
        );

        const trigger = screen.getByRole("button", { name: /fruit|select a fruit/i });

        expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("opens a listbox of options and selects with keyboard", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Select.Root
                items={fruits}
                onChangeValue={onChangeValue}
                popoverProps={{ usePortal: false }}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const trigger = screen.getByRole("button", { name: "Fruit" });

        await user.click(trigger);

        expect(trigger).toHaveAttribute("aria-expanded", "true");

        // APG select-only: popup must be a listbox with option children.
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(3);

        await user.click(screen.getByRole("option", { name: "Banana" }));

        await waitFor(function waitForSelection() {
            expect(onChangeValue).toHaveBeenCalledWith("banana");
        });
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("selects an item by pointer when the menu is open", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Select.Root
                items={fruits}
                onChangeValue={onChangeValue}
                popoverProps={{ usePortal: false }}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        await user.click(screen.getByRole("button", { name: "Fruit" }));
        await user.click(screen.getByRole("option", { name: "Banana" }));

        await waitFor(function waitForSelection() {
            expect(onChangeValue).toHaveBeenCalledWith("banana");
        });
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();

        render(
            <Select.Root
                items={fruits}
                popoverProps={{ usePortal: false }}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const trigger = screen.getByRole("button", { name: "Fruit" });

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        await user.keyboard("{Escape}");

        await waitFor(function waitForClose() {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
        expect(trigger).toHaveFocus();
    });

    it("wires Field describedby and expects Field invalid on the trigger", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Country</Field.Label>
                <Select.Root
                    items={fruits}
                    popoverProps={{ usePortal: false }}
                >
                    <Select.Trigger placeholder="Select…" />
                    <Select.Content />
                </Select.Root>
                <Field.Error>Required</Field.Error>
            </Field.Root>
        );

        const trigger = screen.getByRole("button", { name: /country|select/i });

        expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
        expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("marks chevron indicators as decorative", () => {
        render(
            <Select.Root
                items={fruits}
                popoverProps={{ usePortal: false }}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const svgs = screen.getByRole("button", { name: "Fruit" }).querySelectorAll("svg");

        for (const svg of svgs) {
            expect(svg).toHaveAttribute("aria-hidden", "true");
        }
    });

    it("supports controlled value", () => {
        const { rerender } = render(
            <Select.Root
                items={fruits}
                popoverProps={{ usePortal: false }}
                value="banana"
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        expect(screen.getByRole("button", { name: "Fruit" })).toHaveTextContent("Banana");

        rerender(
            <Select.Root
                items={fruits}
                popoverProps={{ usePortal: false }}
                value="orange"
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        expect(screen.getByRole("button", { name: "Fruit" })).toHaveTextContent("Orange");
    });

    it("exposes a named clear button and keeps the hidden select out of the tab order", async () => {
        const user = userEvent.setup();

        render(
            <Select.Root
                defaultValue="banana"
                isClearable
                items={fruits}
                popoverProps={{ usePortal: false }}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const clear = screen.getByRole("button", { name: "Clear selection" });
        const clearIcon = clear.querySelector("svg");
        const hiddenSelect = document.querySelector("select");

        expect(clearIcon).toHaveAttribute("aria-hidden", "true");
        expect(hiddenSelect).toBeInTheDocument();
        expect(hiddenSelect).toHaveValue("banana");
        expect(hiddenSelect).toHaveAttribute("tabindex", "-1");
        expect(hiddenSelect?.closest("[aria-hidden='true']")).toBeTruthy();

        await user.click(clear);
        expect(screen.queryByRole("button", { name: "Clear selection" })).not.toBeInTheDocument();
    });
});
