import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";
import { render } from "../test/render";
import * as Field from "./index";

describe("Field", () => {
    it("associates the label with the control via htmlFor and id", () => {
        render(
            <Field.Root id="username">
                <Field.Label>Username</Field.Label>
                <Input />
            </Field.Root>
        );

        const input = screen.getByRole("textbox");
        const label = screen.getByText("Username");

        expect(input).toHaveAttribute("id", "username");
        expect(label).toHaveAttribute("for", "username");
        expect(label.tagName).toBe("LABEL");
    });

    it("wires hint into aria-describedby", () => {
        render(
            <Field.Root id="email">
                <Field.Label>Email</Field.Label>
                <Input />
                <Field.Hint>Use your work email.</Field.Hint>
            </Field.Root>
        );

        const input = screen.getByRole("textbox");
        const hint = screen.getByText("Use your work email.");

        expect(hint).toHaveAttribute("id", "email-hint");
        expect(input).toHaveAttribute("aria-describedby", "email-hint");
    });

    it("shows error text when invalid and wires it into aria-describedby", () => {
        render(
            <Field.Root
                id="email"
                isInvalid
            >
                <Field.Label>Email</Field.Label>
                <Input />
                <Field.Error>Enter a valid email.</Field.Error>
            </Field.Root>
        );

        const input = screen.getByRole("textbox");
        const error = screen.getByText("Enter a valid email.");

        expect(error).toBeVisible();
        expect(error).toHaveAttribute("id", "email-feedback");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("aria-describedby", "email-feedback");
    });

    it("hides hint when invalid so describedby points at the error", () => {
        render(
            <Field.Root
                id="email"
                isInvalid
            >
                <Field.Label>Email</Field.Label>
                <Input />
                <Field.Hint>Use your work email.</Field.Hint>
                <Field.Error>Enter a valid email.</Field.Error>
            </Field.Root>
        );

        expect(screen.queryByText("Use your work email.")).not.toBeInTheDocument();
        expect(screen.getByText("Enter a valid email.")).toBeVisible();
        expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "email-feedback");
    });

    it("shows a required indicator and marks the control as required", () => {
        render(
            <Field.Root
                id="email"
                isRequired
            >
                <Field.Label>Email</Field.Label>
                <Input />
            </Field.Root>
        );

        const indicator = screen.getByText("*");
        const input = screen.getByRole("textbox");

        expect(indicator).toHaveAttribute("aria-hidden", "true");
        expect(indicator).toHaveAttribute("role", "presentation");
        expect(input).toBeRequired();
        expect(input).toHaveAttribute("aria-required", "true");
    });

    it("marks ErrorIcon as decorative relative to error text", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Email</Field.Label>
                <Input />
                <Field.Error>
                    <Field.ErrorIcon />
                    Enter a valid email.
                </Field.Error>
            </Field.Root>
        );

        const errorIcon = document.querySelector('[data-part="errorIcon"]');
        expect(errorIcon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByText("Enter a valid email.")).toBeVisible();
    });

    it("supports label/hint/error shortcut props with isInvalid", () => {
        render(
            <Field.Root
                error="Too short"
                hint="At least 3 characters"
                id="username"
                isInvalid
                label="Username"
            >
                <Input />
            </Field.Root>
        );

        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.queryByText("At least 3 characters")).not.toBeInTheDocument();
        expect(screen.getByText("Too short")).toBeVisible();
    });
});
