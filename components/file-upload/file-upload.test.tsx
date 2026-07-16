import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as FileUpload from "./index";

describe("FileUpload", () => {
    it("composes with Field for labeling and uses a hidden file input", () => {
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
                    <FileUpload.List clearable showSize />
                </FileUpload.Root>
                <Field.Hint>PDF only, max 5 MB.</Field.Hint>
            </Field.Root>
        );

        const fileInput = document.querySelector('input[type="file"]');
        const label = screen.getByText("Resume");
        const trigger = document.querySelector('[data-part="trigger"]');

        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("accept", ".pdf");
        expect(fileInput).toHaveAttribute("name", "resume");
        expect(label).toHaveAttribute("for", "resume");
        expect(trigger).toHaveAttribute("type", "button");
        // Field must wire id / describedby onto the authoritative file input
        expect(fileInput).toHaveAttribute("id", "resume");
        expect(fileInput).toHaveAttribute("aria-describedby", "resume-hint");
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
        expect(trigger).toHaveAttribute("data-part", "trigger");
    });

    it("disables the trigger when Root is disabled", () => {
        render(
            <FileUpload.Root disabled>
                <FileUpload.Trigger>Browse</FileUpload.Trigger>
            </FileUpload.Root>
        );

        expect(screen.getByRole("button", { name: "Browse" })).toBeDisabled();
        expect(document.querySelector('input[type="file"]')).toBeDisabled();
    });

    it("marks the file input required and invalid from Root props", () => {
        render(
            <Field.Root
                id="resume"
                isInvalid
                isRequired
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

        expect(fileInput).toBeRequired();
        expect(screen.getByText("Please upload a valid file.")).toBeVisible();
        // Invalid / describedby must reach the file input for AT
        expect(fileInput).toHaveAttribute("aria-invalid", "true");
        expect(fileInput).toHaveAttribute("aria-describedby", "resume-feedback");
    });

    it("gives delete and clear controls accessible names", async () => {
        const user = userEvent.setup();
        const file = new File(["hello"], "resume.pdf", { type: "application/pdf" });

        render(
            <FileUpload.Root>
                <FileUpload.Trigger>Browse</FileUpload.Trigger>
                <FileUpload.Context>
                    {function renderAccepted(ctx) {
                        if (ctx.acceptedFiles.length === 0) {
                            return (
                                <button
                                    onClick={function acceptDemoFile() {
                                        ctx.setFiles([file]);
                                    }}
                                    type="button"
                                >
                                    Seed file
                                </button>
                            );
                        }

                        return (
                            <>
                                <FileUpload.List clearable />
                                <FileUpload.ClearTrigger>Clear</FileUpload.ClearTrigger>
                            </>
                        );
                    }}
                </FileUpload.Context>
            </FileUpload.Root>
        );

        await user.click(screen.getByRole("button", { name: "Seed file" }));

        expect(screen.getByRole("button", { name: "Remove resume.pdf" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Clear all files" })).toBeInTheDocument();
    });
});
