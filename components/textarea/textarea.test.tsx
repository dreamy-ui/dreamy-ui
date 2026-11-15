import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Textarea, TextareaNoAutoSize } from "./index";

beforeAll(() => {
    const css = globalThis.CSS as { supports?: unknown } | undefined;
    if (css && typeof css.supports !== "function") {
        css.supports = () => true;
    }
});

describe("Textarea", () => {
    it("exposes a native multiline textbox", () => {
        render(<Textarea aria-label="Bio" />);

        const textarea = screen.getByRole("textbox", { name: "Bio" });

        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea).not.toHaveAttribute("role");
    });

    it("wires Field label, hint/error, and invalid state", async () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Bio</Field.Label>
                <Textarea />
                <Field.Error>Bio is required.</Field.Error>
            </Field.Root>
        );

        const textarea = screen.getByRole("textbox", { name: "Bio" });
        const label = screen.getByText("Bio");

        await waitFor(() => {
            expect(label).toHaveAttribute("for", textarea.id);
        });
        expect(textarea).toHaveAttribute("aria-invalid", "true");
        expect(textarea.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("inserts newlines on Enter and calls value callbacks", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onValueChange = vi.fn();

        render(
            <Textarea
                aria-label="Bio"
                onChange={onChange}
                onValueChange={onValueChange}
            />
        );

        const textarea = screen.getByRole("textbox", { name: "Bio" });

        await user.type(textarea, "line1{Enter}line2");

        expect(textarea).toHaveValue("line1\nline2");
        expect(onChange).toHaveBeenCalled();
        expect(onValueChange).toHaveBeenCalled();
        expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("line1\nline2");
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

    it("keeps Field.Label as the accessible name when a placeholder is present", () => {
        render(
            <Field.Root>
                <Field.Label>Bio</Field.Label>
                <Textarea placeholder="Tell us about yourself" />
            </Field.Root>
        );

        expect(screen.getByRole("textbox", { name: "Bio" })).toBeInTheDocument();
        expect(
            screen.queryByRole("textbox", { name: "Tell us about yourself" })
        ).not.toBeInTheDocument();
    });
});
