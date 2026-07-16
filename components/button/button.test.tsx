import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import { Button } from "./index";

describe("Button", () => {
    it("renders a native button with type=button by default", () => {
        render(<Button>Save</Button>);

        const button = screen.getByRole("button", { name: "Save" });

        expect(button.tagName).toBe("BUTTON");
        expect(button).toHaveAttribute("type", "button");
    });

    it("calls onClick when activated with pointer and keyboard", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button onClick={onClick}>Save</Button>);

        const button = screen.getByRole("button", { name: "Save" });
        await user.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);

        button.focus();
        await user.keyboard("{Enter}");
        expect(onClick).toHaveBeenCalledTimes(2);

        await user.keyboard(" ");
        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("does not activate when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <Button
                isDisabled
                onClick={onClick}
            >
                Save
            </Button>
        );

        const button = screen.getByRole("button", { name: "Save" });

        expect(button).toBeDisabled();
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("does not activate when loading and keeps an accessible name", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <Button
                isLoading
                loadingText="Saving"
                onClick={onClick}
            >
                Save
            </Button>
        );

        const button = screen.getByRole("button", { name: "Saving" });

        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("data-loading");
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("respects explicit type=submit", () => {
        render(<Button type="submit">Submit</Button>);

        expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
    });

    it("marks decorative left/right icons as aria-hidden", () => {
        render(
            <Button
                leftIcon={<span data-testid="left-icon">L</span>}
                rightIcon={<span data-testid="right-icon">R</span>}
            >
                Save
            </Button>
        );

        expect(screen.getByTestId("left-icon")).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByTestId("right-icon")).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
});
