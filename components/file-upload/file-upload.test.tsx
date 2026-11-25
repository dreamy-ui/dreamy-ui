import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import * as Field from "../field";
import { render } from "../test/render";
import * as FileUpload from "./index";

describe("FileUpload", () => {
    it("composes with Field and exposes UI SDK slots and hidden file input", () => {
        render(
            <Field.Root id="resume">
                <Field.Label>Resume</Field.Label>
                <FileUpload.Root
                    accept=".pdf"
                    name="resume"
                >
                    <FileUpload.Dropzone>
                        <FileUpload.DropzoneContent>Drop files or</FileUpload.DropzoneContent>
                        <FileUpload.Trigger>Browse</FileUpload.Trigger>
                    </FileUpload.Dropzone>
                    <FileUpload.List
                        clearable
                        showSize
                    />
                </FileUpload.Root>
                <Field.Hint>PDF only, max 5 MB.</Field.Hint>
            </Field.Root>
        );

        const fileInput = document.querySelector('input[type="file"]');
        const label = screen.getByText("Resume");
        const trigger = screen.getByRole("button", { name: "Resume" });

        expect(document.querySelector('[data-slot="file-input"]')).toBeInTheDocument();
        expect(document.querySelector('[data-slot="file-input-dropzone"]')).toBeInTheDocument();
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("accept", ".pdf");
        expect(fileInput).toHaveAttribute("name", "resume");
        expect(label).toHaveAttribute("for", "resume");
        expect(trigger).toHaveAttribute("type", "button");
        expect(trigger).toHaveAttribute("data-slot", "file-input-trigger");
        expect(trigger).toHaveAttribute("id", "resume");
        expect(trigger).toHaveAttribute("aria-describedby", "resume-hint");
    });

    it("renders a custom Button trigger via render prop", () => {
        render(
            <FileUpload.Root>
                <FileUpload.Trigger render={<Button variant="outline" />}>
                    Upload file
                </FileUpload.Trigger>
            </FileUpload.Root>
        );

        const trigger = screen.getByRole("button", { name: "Upload file" });
        expect(trigger).toHaveClass("file-upload__trigger");
        expect(trigger).toHaveAttribute("type", "button");
    });

    it("keeps a keyboard-accessible trigger as the drag alternative", () => {
        render(
            <FileUpload.Root>
                <FileUpload.Trigger>Browse files</FileUpload.Trigger>
            </FileUpload.Root>
        );

        const trigger = screen.getByRole("button", { name: "Browse files" });

        expect(trigger).toHaveAttribute("type", "button");
        expect(trigger).not.toBeDisabled();
        expect(trigger).toHaveAttribute("data-slot", "file-input-trigger");
    });

    it("disables the trigger and input when Root is disabled", () => {
        render(
            <FileUpload.Root disabled>
                <FileUpload.Trigger>Browse</FileUpload.Trigger>
            </FileUpload.Root>
        );

        expect(screen.getByRole("button", { name: "Browse" })).toBeDisabled();
        expect(document.querySelector('input[type="file"]')).toBeDisabled();
    });

    it("marks the control required and invalid from Root and Field props", async () => {
        render(
            <Field.Root
                id="resume"
                invalid
                required
            >
                <Field.Label>Resume</Field.Label>
                <FileUpload.Root
                    invalid
                    required
                >
                    <FileUpload.Trigger>Browse</FileUpload.Trigger>
                </FileUpload.Root>
                <Field.Error>Please upload a valid file.</Field.Error>
            </Field.Root>
        );

        const fileInput = document.querySelector('input[type="file"]');
        const trigger = screen.getByRole("button", { name: "Resume" });

        expect(fileInput).toBeRequired();
        expect(screen.getByText("Please upload a valid file.")).toBeVisible();
        expect(trigger).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => {
            expect(trigger.getAttribute("aria-describedby") ?? "").toContain("resume-feedback");
        });
    });

    it("adds, lists, removes, and clears files via controller and gives accessible names", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const file = new File(["hello"], "resume.pdf", { type: "application/pdf" });

        render(
            <FileUpload.Root onValueChange={onValueChange}>
                <FileUpload.Trigger>Browse</FileUpload.Trigger>
                <FileUpload.Context>
                    {(ctx) =>
                        ctx.files.length === 0 ? (
                            <button
                                onClick={() => ctx.controller.setValue([file])}
                                type="button"
                            >
                                Seed file
                            </button>
                        ) : (
                            <>
                                <FileUpload.List
                                    clearable
                                    showSize
                                />
                                <FileUpload.ClearTrigger>Clear</FileUpload.ClearTrigger>
                            </>
                        )
                    }
                </FileUpload.Context>
            </FileUpload.Root>
        );

        await user.click(screen.getByRole("button", { name: "Seed file" }));

        expect(onValueChange).toHaveBeenCalledWith([file], expect.anything());
        expect(screen.getByText("resume.pdf")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove resume.pdf" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Clear all files" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Remove resume.pdf" }));
        expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument();
    });
});
