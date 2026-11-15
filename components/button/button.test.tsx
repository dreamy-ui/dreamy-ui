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

    it("shows a decorative success icon, keeps its name and stays interactive when successful", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <Button
                isSuccess
                onClick={onClick}
            >
                Save
            </Button>
        );

        const button = screen.getByRole("button", { name: "Save" });

        expect(button).toHaveAttribute("data-success");
        expect(button).toBeEnabled();
        expect(button.querySelector("[data-success-check]")).toHaveAttribute("aria-hidden", "true");
        await user.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("uses successText as the accessible name and renders a custom success icon", () => {
        render(
            <Button
                isSuccess
                leftIcon={<span data-testid="left-icon">L</span>}
                successIcon={<span data-testid="success-icon">S</span>}
                successText="Saved"
            >
                Save
            </Button>
        );

        expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();
        expect(screen.getByTestId("success-icon")).toHaveAttribute("aria-hidden", "true");
        expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    });

    it("gives loading precedence over success", () => {
        render(
            <Button
                isLoading
                isSuccess
                loadingText="Saving"
                successText="Saved"
            >
                Save
            </Button>
        );

        const button = screen.getByRole("button", { name: "Saving" });

        expect(button).not.toHaveAttribute("data-success");
        expect(button.querySelector("[data-success-icon]")).toBeNull();
    });

    it("keeps icons visible when status texts are set but no status is active", () => {
        render(
            <Button
                leftIcon={<span data-testid="left-icon">L</span>}
                loadingText="Saving"
                successText="Saved"
            >
                Save
            </Button>
        );

        expect(screen.getByTestId("left-icon")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
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
