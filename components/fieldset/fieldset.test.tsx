import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as Field from "../field";
import { Input } from "../input";
import { render } from "../test/render";
import * as Fieldset from "./index";

describe("Fieldset", () => {
    it("renders a native fieldset with a legend as the group name", () => {
        render(
            <Fieldset.Root>
                <Fieldset.Header>
                    <Fieldset.Legend>Shipping address</Fieldset.Legend>
                    <Fieldset.HelperText>Where should we deliver?</Fieldset.HelperText>
                </Fieldset.Header>
                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Street</Field.Label>
                        <Input />
                    </Field.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        );

        const fieldset = document.querySelector("fieldset");
        const legend = screen.getByText("Shipping address");

        expect(fieldset).toBeInTheDocument();
        expect(legend.tagName).toBe("LEGEND");
        expect(screen.getByText("Where should we deliver?")).toBeInTheDocument();
        expect(screen.getByLabelText("Street")).toBeInTheDocument();
        // Legend must name the fieldset (legend should not be trapped in a layout wrapper)
        expect(screen.getByRole("group", { name: "Shipping address" })).toBe(fieldset);
    });

    it("exposes group-level invalid state with ErrorText", () => {
        render(
            <Fieldset.Root invalid>
                <Fieldset.Header>
                    <Fieldset.Legend>Payment</Fieldset.Legend>
                </Fieldset.Header>
                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Card number</Field.Label>
                        <Input />
                    </Field.Root>
                </Fieldset.Content>
                <Fieldset.ErrorText>Fix the payment details.</Fieldset.ErrorText>
            </Fieldset.Root>
        );

        const fieldset = document.querySelector("fieldset");

        expect(fieldset).toHaveAttribute("aria-invalid", "true");
        expect(fieldset).toHaveAttribute("data-invalid");
        expect(screen.getByText("Fix the payment details.")).toBeVisible();
        expect(screen.getByRole("group", { name: "Payment" })).toBe(fieldset);
    });

    it("disables descendant controls when the fieldset is disabled", () => {
        render(
            <Fieldset.Root disabled>
                <Fieldset.Header>
                    <Fieldset.Legend>Account</Fieldset.Legend>
                </Fieldset.Header>
                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Username</Field.Label>
                        <Input />
                    </Field.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        );

        const fieldset = document.querySelector("fieldset");

        expect(fieldset).toBeDisabled();
        expect(fieldset).toHaveAttribute("data-disabled");
        expect(screen.getByLabelText("Username")).toBeDisabled();
    });

    it("keeps layout slots free of widget roles", () => {
        render(
            <Fieldset.Root>
                <Fieldset.Header data-testid="header">
                    <Fieldset.Legend>Profile</Fieldset.Legend>
                </Fieldset.Header>
                <Fieldset.Content data-testid="content">
                    <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input />
                    </Field.Root>
                </Fieldset.Content>
                <Fieldset.Footer data-testid="footer">
                    <button type="button">Save</button>
                </Fieldset.Footer>
            </Fieldset.Root>
        );

        expect(screen.getByTestId("header")).not.toHaveAttribute("role");
        expect(screen.getByTestId("content")).not.toHaveAttribute("role");
        expect(screen.getByTestId("footer")).not.toHaveAttribute("role");
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
});
