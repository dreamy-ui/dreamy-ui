import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import { IconButton } from "./index";

function EditIcon() {
    return <span data-testid="edit-icon">✎</span>;
}

describe("IconButton", () => {
    it("requires an accessible name via aria-label", () => {
        render(
            <IconButton
                aria-label="Edit profile"
                icon={<EditIcon />}
            />
        );

        expect(screen.getByRole("button", { name: "Edit profile" })).toBeInTheDocument();
    });

    it("defaults to type=button", () => {
        render(
            <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
            />
        );

        expect(screen.getByRole("button", { name: "Edit" })).toHaveAttribute("type", "button");
    });

    it("calls onClick when activated", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                onClick={onClick}
            />
        );

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("activates with Enter and Space and keeps a single accessible name", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <IconButton
                aria-label="Edit profile"
                icon={<EditIcon />}
                onClick={onClick}
            />
        );

        const button = screen.getByRole("button", { name: "Edit profile" });
        const icon = screen.getByTestId("edit-icon");

        expect(icon).not.toHaveAttribute("aria-label");
        expect(screen.getAllByRole("button", { name: "Edit profile" })).toHaveLength(1);

        button.focus();
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("does not activate when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                isDisabled
                onClick={onClick}
            />
        );

        const button = screen.getByRole("button", { name: "Edit" });
        expect(button).toBeDisabled();
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("does not activate when loading", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                isLoading
                onClick={onClick}
            />
        );

        const button = screen.getByRole("button", { name: "Edit" });
        expect(button).toBeDisabled();
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });
});
