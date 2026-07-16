import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Input } from "./index";

describe("Input", () => {
    it("exposes a native textbox without a custom role", () => {
        render(<Input aria-label="Username" />);

        const input = screen.getByRole("textbox", { name: "Username" });

        expect(input.tagName).toBe("INPUT");
        expect(input).not.toHaveAttribute("role");
    });

    it("wires Field label, hint, error, and invalid state", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Email</Field.Label>
                <Input
                    autoComplete="email"
                    type="email"
                />
                <Field.Error>Enter a valid email.</Field.Error>
            </Field.Root>
        );

        const input = screen.getByRole("textbox", { name: "Email" });
        const label = screen.getByText("Email");

        expect(label).toHaveAttribute("for", input.id);
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("autocomplete", "email");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("links Field.Hint via aria-describedby when valid", () => {
        render(
            <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input type="email" />
                <Field.Hint>We will never share it.</Field.Hint>
            </Field.Root>
        );

        const input = screen.getByRole("textbox", { name: "Email" });
        const hint = screen.getByText("We will never share it.");

        expect(input.getAttribute("aria-describedby")).toContain(hint.id);
    });

    it("calls onChange and onChangeValue when typing", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onChangeValue = vi.fn();

        render(
            <Input
                aria-label="Username"
                onChange={onChange}
                onChangeValue={onChangeValue}
            />
        );

        await user.type(screen.getByRole("textbox", { name: "Username" }), "ada");

        expect(onChange).toHaveBeenCalled();
        expect(onChangeValue).toHaveBeenCalledWith("a");
        expect(onChangeValue).toHaveBeenLastCalledWith("ada");
    });

    it("respects disabled and required from Field", () => {
        render(
            <Field.Root
                isDisabled
                isRequired
            >
                <Field.Label>Username</Field.Label>
                <Input />
            </Field.Root>
        );

        const input = screen.getByRole("textbox", { name: "Username" });

        expect(input).toBeDisabled();
        expect(input).toBeRequired();
    });

    it("forwards remaining props to the input element", () => {
        render(
            <Input
                aria-label="Search"
                className="custom-input"
                data-testid="input"
                name="q"
                placeholder="Search…"
            />
        );

        const input = screen.getByTestId("input");

        expect(input).toHaveClass("custom-input");
        expect(input).toHaveAttribute("name", "q");
        expect(input).toHaveAttribute("placeholder", "Search…");
    });
});
