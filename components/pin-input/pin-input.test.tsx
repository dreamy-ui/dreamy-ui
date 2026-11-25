import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as PinInput from "./index";

describe("PinInput", () => {
    it("renders a single real input with auto-indexed UI SDK slots", () => {
        render(
            <PinInput.Root aria-label="Verification code">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const root = document.querySelector('[data-slot="otp-input"]');
        const slots = document.querySelectorAll('[data-slot="otp-input-slot"]');
        const input = screen.getByRole("textbox", { name: "Verification code" });

        expect(root).toBeInTheDocument();
        expect(slots).toHaveLength(4);
        expect(input).toHaveAttribute("maxlength", "4");
        expect(input).toHaveAttribute("autocomplete", "one-time-code");
    });

    it("connects to Field.Label and Field.Root invalid state", () => {
        render(
            <Field.Root
                id="otp-code"
                invalid
            >
                <Field.Label>Verification code</Field.Label>
                <PinInput.Root>
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Root>
                <Field.Error>Invalid code</Field.Error>
            </Field.Root>
        );

        const input = screen.getByLabelText("Verification code");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(document.querySelector('[data-slot="otp-input"]')).toHaveAttribute("data-invalid");
    });

    it("masks characters visually when mask is enabled", () => {
        render(
            <PinInput.Root
                aria-label="Security PIN"
                defaultValue="1234"
                mask
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const slots = document.querySelectorAll('[data-slot="otp-input-slot"]');
        expect(slots).toHaveLength(4);
        for (const slot of slots) {
            expect(slot).toHaveTextContent("•");
        }
    });

    it("filters characters by pattern and calls onValueChange and onValueCommit", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();

        render(
            <PinInput.Root
                aria-label="Digits code"
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
                pattern="digits"
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const input = screen.getByRole("textbox", { name: "Digits code" });
        await user.type(input, "1a2b34");

        await waitFor(() => {
            expect(onValueCommit).toHaveBeenCalledWith("1234", expect.anything());
        });
        expect(onValueChange).toHaveBeenCalled();

        const slots = document.querySelectorAll('[data-slot="otp-input-slot"]');
        expect(slots[0]).toHaveTextContent("1");
        expect(slots[1]).toHaveTextContent("2");
        expect(slots[2]).toHaveTextContent("3");
        expect(slots[3]).toHaveTextContent("4");
    });

    it("handles Backspace editing and controlled values", async () => {
        const user = userEvent.setup();

        render(
            <PinInput.Root
                aria-label="Editable code"
                defaultValue="123"
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const input = screen.getByRole("textbox", { name: "Editable code" });
        await user.click(input);
        await user.keyboard("{Backspace}");

        expect(input).toHaveValue("12");
    });

    it("supports controlled value updates", () => {
        const { rerender } = render(
            <PinInput.Root
                aria-label="Controlled code"
                value="12"
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        let slots = document.querySelectorAll('[data-slot="otp-input-slot"]');
        expect(slots[0]).toHaveTextContent("1");
        expect(slots[1]).toHaveTextContent("2");

        rerender(
            <PinInput.Root
                aria-label="Controlled code"
                value="98"
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        slots = document.querySelectorAll('[data-slot="otp-input-slot"]');
        expect(slots[0]).toHaveTextContent("9");
        expect(slots[1]).toHaveTextContent("8");
    });

    it("supports disabled state and grouped separators", () => {
        render(
            <PinInput.Root
                aria-label="Grouped code"
                disabled
            >
                <PinInput.Group>
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Group>
                <PinInput.Separator />
                <PinInput.Group>
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Group>
            </PinInput.Root>
        );

        expect(screen.getByRole("textbox", { name: "Grouped code" })).toBeDisabled();
        expect(document.querySelectorAll('[data-slot="otp-input-slot"]')).toHaveLength(4);
        expect(document.querySelector('[data-slot="otp-input-separator"]')).toBeInTheDocument();
    });
});
