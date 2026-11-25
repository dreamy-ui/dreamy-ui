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
                <Select.Root items={fruits}>
                    <Select.Trigger placeholder="Select a fruit" />
                    <Select.Content />
                </Select.Root>
            </Field.Root>
        );

        const trigger = screen.getByRole("combobox", { name: /fruit|select a fruit/i });

        expect(trigger).toHaveAttribute("data-slot", "select-trigger");
        expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("navigates options with the keyboard and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Select.Root
                items={fruits}
                onValueChange={onValueChange}
                reduceMotion
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const trigger = screen.getByRole("combobox", { name: "Fruit" });

        trigger.focus();
        await user.keyboard("{ArrowDown}");

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(await screen.findByRole("listbox")).toBeInTheDocument();

        await user.keyboard("{Enter}");

        await waitFor(function waitForSelection() {
            expect(onValueChange).toHaveBeenCalledWith("strawberry", expect.anything());
        });
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        await waitFor(function waitForTriggerFocus() {
            expect(trigger).toHaveFocus();
        });
    });

    it("opens a listbox of options and selects by pointer", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Select.Root
                items={fruits}
                onValueChange={onValueChange}
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const trigger = screen.getByRole("combobox", { name: "Fruit" });

        await user.click(trigger);

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(3);

        await user.click(screen.getByRole("option", { name: "Banana" }));

        await waitFor(function waitForSelection() {
            expect(onValueChange).toHaveBeenCalledWith("banana", expect.anything());
        });
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        await waitFor(function waitForTriggerFocus() {
            expect(trigger).toHaveFocus();
        });
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();

        render(
            <Select.Root
                items={fruits}
                reduceMotion
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const trigger = screen.getByRole("combobox", { name: "Fruit" });

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        await user.keyboard("{Escape}");

        await waitFor(function waitForClose() {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
        await waitFor(function waitForFocus() {
            expect(trigger).toHaveFocus();
        });
    });

    it("wires Field describedby and invalid onto the trigger", () => {
        render(
            <Field.Root invalid>
                <Field.Label>Country</Field.Label>
                <Select.Root items={fruits}>
                    <Select.Trigger placeholder="Select…" />
                    <Select.Content />
                </Select.Root>
                <Field.Error>Required</Field.Error>
            </Field.Root>
        );

        const trigger = screen.getByRole("combobox", { name: /country|select/i });

        expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
        expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("marks chevron indicators as decorative", () => {
        render(
            <Select.Root items={fruits}>
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        const svgs = screen.getByRole("combobox", { name: "Fruit" }).querySelectorAll("svg");

        for (const svg of svgs) {
            expect(svg).toHaveAttribute("aria-hidden", "true");
        }
    });

    it("supports controlled value and multiple mode", async () => {
        const user = userEvent.setup();
        const onMultipleChange = vi.fn();

        const { rerender } = render(
            <Select.Root
                items={fruits}
                value="banana"
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Banana");

        rerender(
            <Select.Root
                items={fruits}
                value="orange"
            >
                <Select.Trigger
                    aria-label="Fruit"
                    placeholder="Select a fruit"
                />
                <Select.Content />
            </Select.Root>
        );

        expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Orange");
    });

    it("supports multiple selection mode", async () => {
        const user = userEvent.setup();
        const onMultipleChange = vi.fn();

        render(
            <Select.Root
                defaultValue={["strawberry"]}
                items={fruits}
                multiple
                onValueChange={onMultipleChange}
            >
                <Select.Trigger
                    aria-label="Fruits"
                    placeholder="Select fruits"
                />
                <Select.Content />
            </Select.Root>
        );

        await user.click(screen.getByRole("combobox", { name: "Fruits" }));
        await user.click(screen.getByRole("option", { name: "Banana" }));

        await waitFor(() => {
            expect(onMultipleChange).toHaveBeenCalledWith(
                ["strawberry", "banana"],
                expect.anything()
            );
        });
    });

    it("exposes a named clear button and submits form value under name", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <form>
                <Select.Root
                    clearable
                    defaultValue="banana"
                    items={fruits}
                    name="fruit"
                    onValueChange={onValueChange}
                >
                    <Select.Trigger
                        aria-label="Fruit"
                        placeholder="Select a fruit"
                    />
                    <Select.Content />
                </Select.Root>
            </form>
        );

        const clear = screen.getByRole("button", { name: "Clear selection" });
        const clearIcon = clear.querySelector("svg");
        expect(clearIcon).toHaveAttribute("aria-hidden", "true");

        const form = document.querySelector("form") as HTMLFormElement;
        expect(new FormData(form).get("fruit")).toBe("banana");

        await user.click(clear);

        await waitFor(() => {
            expect(onValueChange).toHaveBeenCalledWith(
                null,
                expect.objectContaining({ reason: "clear-press" })
            );
        });
        expect(screen.queryByRole("button", { name: "Clear selection" })).not.toBeInTheDocument();
    });
});
