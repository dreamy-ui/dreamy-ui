import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import { CloseButton } from "./index";

describe("CloseButton", () => {
    it("defaults aria-label to Close", () => {
        render(<CloseButton />);

        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("allows overriding the accessible name", () => {
        render(<CloseButton aria-label="Close dialog" />);

        expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    });

    it("defaults to type=button", () => {
        render(<CloseButton />);

        expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("type", "button");
    });

    it("calls onClick when activated", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<CloseButton onClick={onClick} />);

        await user.click(screen.getByRole("button", { name: "Close" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates with Enter and Space and ignores disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        const { rerender } = render(<CloseButton onClick={onClick} />);

        const button = screen.getByRole("button", { name: "Close" });
        button.focus();
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        expect(onClick).toHaveBeenCalledTimes(2);

        rerender(
            <CloseButton
                isDisabled
                onClick={onClick}
            />
        );

        const disabled = screen.getByRole("button", { name: "Close" });
        expect(disabled).toBeDisabled();
        await user.click(disabled);
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("does not activate when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <CloseButton
                isDisabled
                onClick={onClick}
            />
        );

        const button = screen.getByRole("button", { name: "Close" });
        expect(button).toBeDisabled();
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("keeps a single accessible name without duplicate icon naming", () => {
        render(<CloseButton aria-label="Close settings" />);

        const button = screen.getByRole("button", { name: "Close settings" });
        const decorativeIcon = button.querySelector("svg");

        expect(decorativeIcon).toHaveAttribute("aria-hidden", "true");
        expect(decorativeIcon).not.toHaveAttribute("aria-label");
        expect(decorativeIcon).not.toHaveAttribute("role", "img");
    });
});
