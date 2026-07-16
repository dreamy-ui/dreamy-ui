import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as PinInput from "./index";

describe("PinInput", () => {
    function getPinFields() {
        return screen.getAllByRole("textbox");
    }

    it("renders native single-character fields for each digit", () => {
        render(
            <PinInput.Root>
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const fields = getPinFields();

        expect(fields).toHaveLength(4);
        for (const field of fields) {
            expect(field.tagName).toBe("INPUT");
            expect(field).toHaveAttribute("maxlength", "1");
            expect(field).toHaveAttribute("aria-label", "Please enter your pin code");
        }
    });

    it("exposes group semantics for the pin as a whole", () => {
        render(
            <Field.Root>
                <Field.Label>Verification code</Field.Label>
                <PinInput.Root>
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Root>
            </Field.Root>
        );

        const root = document.querySelector("[data-pin-input]");

        expect(root).toBeInTheDocument();
        expect(root).toHaveAttribute("role", "group");
    });

    it("sets autocomplete one-time-code when otp is enabled", () => {
        render(
            <PinInput.Root otp>
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        for (const field of getPinFields()) {
            expect(field).toHaveAttribute("autocomplete", "one-time-code");
        }
    });

    it("advances focus while typing and calls onComplete", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onComplete = vi.fn();

        render(
            <PinInput.Root
                onChange={onChange}
                onComplete={onComplete}
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const fields = getPinFields();

        await user.type(fields[0], "1");
        await user.type(fields[1], "2");
        await user.type(fields[2], "3");
        await user.type(fields[3], "4");

        await waitFor(function waitForComplete() {
            expect(onComplete).toHaveBeenCalledWith("1234");
        });
        expect(onChange).toHaveBeenCalled();
    });

    it("moves between cells with arrow keys when manageFocus is enabled", async () => {
        render(
            <PinInput.Root
                defaultValue="12"
                manageFocus
            >
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const fields = getPinFields();

        fields[0].focus();
        fireEvent.keyDown(fields[0], { key: "ArrowRight" });

        await waitFor(function waitForNextFocus() {
            expect(fields[1]).toHaveFocus();
        });

        fireEvent.keyDown(fields[1], { key: "ArrowLeft" });

        await waitFor(function waitForPrevFocus() {
            expect(fields[0]).toHaveFocus();
        });
    });

    it("wires Field invalid onto pin fields", () => {
        render(
            <Field.Root isInvalid>
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

        for (const field of getPinFields()) {
            expect(field).toHaveAttribute("aria-invalid", "true");
        }
    });

    it("supports controlled value", () => {
        const { rerender } = render(
            <PinInput.Root value="12">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        const fields = getPinFields();

        expect(fields[0]).toHaveValue("1");
        expect(fields[1]).toHaveValue("2");

        rerender(
            <PinInput.Root value="99">
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
                <PinInput.Field />
            </PinInput.Root>
        );

        expect(fields[0]).toHaveValue("9");
        expect(fields[1]).toHaveValue("9");
    });
});
