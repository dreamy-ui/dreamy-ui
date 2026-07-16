import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as Editable from "./index";

describe("Editable", () => {
    it("shows preview in view mode and named action buttons", () => {
        render(
            <Editable.Root defaultValue="Ada">
                <Editable.Preview />
                <Editable.Input />
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </Editable.Root>
        );

        expect(screen.getByText("Ada")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("enters edit mode from the Edit button and focuses the input", async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();

        render(
            <Editable.Root
                defaultValue="Ada"
                onEdit={onEdit}
            >
                <Editable.Preview />
                <Editable.Input />
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </Editable.Root>
        );

        await user.click(screen.getByRole("button", { name: "Edit" }));

        expect(onEdit).toHaveBeenCalled();
        expect(screen.getByDisplayValue("Ada")).toHaveFocus();
    });

    it("submits with Enter and cancels with Escape", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <Editable.Root
                defaultValue="Ada"
                onCancel={onCancel}
                onSubmit={onSubmit}
            >
                <Editable.Preview />
                <Editable.Input />
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </Editable.Root>
        );

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.clear(screen.getByDisplayValue("Ada"));
        await user.type(screen.getByRole("textbox"), "Grace{Enter}");

        await waitFor(function waitForSubmit() {
            expect(onSubmit).toHaveBeenCalledWith("Grace");
        });
        expect(screen.getByText("Grace")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.clear(screen.getByDisplayValue("Grace"));
        await user.type(screen.getByRole("textbox"), "Alan{Escape}");

        await waitFor(function waitForCancel() {
            expect(onCancel).toHaveBeenCalledWith("Grace");
        });
        expect(screen.getByText("Grace")).toBeInTheDocument();
    });

    it("keeps preview and input mutually exclusive while editing", async () => {
        const user = userEvent.setup();

        render(
            <Editable.Root defaultValue="Ada">
                <Editable.Preview data-testid="preview" />
                <Editable.Input data-testid="input" />
                <Editable.EditButton />
            </Editable.Root>
        );

        const preview = screen.getByTestId("preview");
        const input = screen.getByTestId("input");

        expect(preview).not.toHaveAttribute("hidden");
        expect(input).toHaveAttribute("hidden");

        await user.click(screen.getByRole("button", { name: "Edit" }));

        expect(preview).toHaveAttribute("hidden");
        expect(input).not.toHaveAttribute("hidden");
    });

    it("blocks edit actions when disabled", async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();

        render(
            <Editable.Root
                defaultValue="Ada"
                isDisabled
                onEdit={onEdit}
            >
                <Editable.Preview />
                <Editable.Input />
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </Editable.Root>
        );

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(onEdit).not.toHaveBeenCalled();
    });

    it("supports controlled value and Field labeling", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Field.Root>
                <Field.Label>Display name</Field.Label>
                <Editable.Root
                    onChange={onChange}
                    value="Ada"
                >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.EditButton />
                    <Editable.SubmitButton />
                    <Editable.CancelButton />
                </Editable.Root>
            </Field.Root>
        );

        expect(screen.getByText("Display name")).toBeInTheDocument();
        expect(screen.getByText("Ada")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.type(screen.getByRole("textbox"), " Lovelace");

        expect(onChange).toHaveBeenCalled();
    });
});
