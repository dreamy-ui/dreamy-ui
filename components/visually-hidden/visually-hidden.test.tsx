import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { VisuallyHidden, VisuallyHiddenInput } from "./index";

describe("VisuallyHidden", () => {
    it("keeps text available to assistive technology", () => {
        render(
            <button type="button">
                <span aria-hidden="true">X</span>
                <VisuallyHidden>Close dialog</VisuallyHidden>
            </button>
        );

        expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
        expect(screen.getByText("Close dialog").tagName).toBe("SPAN");
    });

    it("applies visually hidden styles", () => {
        render(<VisuallyHidden data-testid="sr-only">Screen reader only</VisuallyHidden>);

        const el = screen.getByTestId("sr-only");

        expect(el).toBeInTheDocument();
        expect(el.className.length).toBeGreaterThan(0);
        expect(screen.getByText("Screen reader only")).toBeInTheDocument();
    });

    it("forwards props to the span", () => {
        render(
            <VisuallyHidden
                className="custom-sr"
                id="sr-label"
            >
                Label
            </VisuallyHidden>
        );

        const el = screen.getByText("Label");

        expect(el.tagName).toBe("SPAN");
        expect(el).toHaveClass("custom-sr");
        expect(el).toHaveAttribute("id", "sr-label");
    });
});

describe("VisuallyHiddenInput", () => {
    it("renders a visually hidden readonly input by default", () => {
        render(
            <VisuallyHiddenInput
                data-testid="hidden-input"
                name="token"
                value="abc"
            />
        );

        const input = screen.getByTestId("hidden-input");

        expect(input.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("name", "token");
        expect(input).toHaveValue("abc");
        expect(input).toHaveAttribute("readonly");
        expect(input.className.length).toBeGreaterThan(0);
    });

    it("forwards remaining input props", () => {
        render(
            <VisuallyHiddenInput
                data-testid="hidden-input"
                type="hidden"
                defaultValue="secret"
                readOnly={false}
            />
        );

        const input = screen.getByTestId("hidden-input");

        expect(input).toHaveAttribute("type", "hidden");
        expect(input).toHaveValue("secret");
        expect(input).not.toHaveAttribute("readonly");
    });
});
