import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Textarea, TextareaNoAutoSize } from "./index";

describe("Textarea", () => {
    it("exposes a native multiline textbox", () => {
        render(<Textarea aria-label="Bio" />);

        const textarea = screen.getByRole("textbox", { name: "Bio" });

        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea).not.toHaveAttribute("role");
    });

    it("wires Field label, hint/error, and invalid state", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Bio</Field.Label>
                <Textarea />
                <Field.Error>Bio is required.</Field.Error>
            </Field.Root>
        );

        const textarea = screen.getByRole("textbox", { name: "Bio" });
        const label = screen.getByText("Bio");

        expect(label).toHaveAttribute("for", textarea.id);
        expect(textarea).toHaveAttribute("aria-invalid", "true");
        expect(textarea.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("inserts newlines on Enter and calls value callbacks", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onChangeValue = vi.fn();

        render(
            <Textarea
                aria-label="Bio"
                onChange={onChange}
                onChangeValue={onChangeValue}
            />
        );

        const textarea = screen.getByRole("textbox", { name: "Bio" });

        await user.type(textarea, "line1{Enter}line2");

        expect(textarea).toHaveValue("line1\nline2");
        expect(onChange).toHaveBeenCalled();
        expect(onChangeValue).toHaveBeenCalled();
    });

    it("respects disabled and required from Field", () => {
        render(
            <Field.Root
                isDisabled
                isRequired
            >
                <Field.Label>Notes</Field.Label>
                <Textarea />
            </Field.Root>
        );

        const textarea = screen.getByRole("textbox", { name: "Notes" });

        expect(textarea).toBeDisabled();
        expect(textarea).toBeRequired();
    });

    it("supports TextareaNoAutoSize with the same Field wiring", () => {
        render(
            <Field.Root>
                <Field.Label>Comments</Field.Label>
                <TextareaNoAutoSize />
                <Field.Hint>Optional</Field.Hint>
            </Field.Root>
        );

        const textarea = screen.getByRole("textbox", { name: "Comments" });
        const hint = screen.getByText("Optional");

        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea.getAttribute("aria-describedby")).toContain(hint.id);
    });
});
