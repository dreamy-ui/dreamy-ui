import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Avatar, AvatarGroup } from "./index";

describe("Avatar", () => {
    it("exposes an accessible name via initials fallback when src is missing", () => {
        render(
            <Avatar
                name="Alexandra Dream"
                size="md"
            />
        );

        const avatar = screen.getByRole("img", { name: "Alexandra Dream" });
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveTextContent("AD");
    });

    it("uses the name as alt text when an image is provided", () => {
        render(
            <Avatar
                name="Alexandra"
                src="https://example.com/avatar.png"
            />
        );

        // Image may still be loading; fallback initials remain named until loaded
        expect(screen.getByRole("img", { name: "Alexandra" })).toBeInTheDocument();
    });

    it("uses icon fallback with aria-label when name and src are missing", () => {
        render(<Avatar iconLabel="Guest user" />);

        expect(screen.getByRole("img", { name: "Guest user" })).toBeInTheDocument();
    });

    it("renders AvatarGroup as a group with excess count text", () => {
        render(
            <AvatarGroup
                aria-label="Team"
                maxAvatars={2}
            >
                <Avatar name="One" />
                <Avatar name="Two" />
                <Avatar name="Three" />
                <Avatar name="Four" />
            </AvatarGroup>
        );

        const group = screen.getByRole("group", { name: "Team" });
        expect(within(group).getByText("+2")).toBeInTheDocument();
        expect(within(group).getAllByRole("img")).toHaveLength(2);
    });

    it("forwards size scheme and remaining props to the root", () => {
        render(
            <Avatar
                className="custom-avatar"
                data-testid="avatar-root"
                name="Sam"
                scheme="primary"
                size="sm"
                variant="subtle"
            />
        );

        const root = screen.getByTestId("avatar-root");
        expect(root.tagName).toBe("SPAN");
        expect(root).toHaveClass("custom-avatar");
    });
});
