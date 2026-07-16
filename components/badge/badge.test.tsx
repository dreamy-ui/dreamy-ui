import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Badge } from "./index";

describe("Badge", () => {
    it("renders informative visible text as its accessible name", () => {
        render(<Badge>New</Badge>);

        expect(screen.getByText("New")).toBeInTheDocument();
        expect(screen.getByText("New").tagName).toBe("DIV");
    });

    it("supports aria-label for icon-only informative badges", () => {
        render(
            <Badge
                aria-label="3 unread"
                data-testid="badge"
            >
                <span aria-hidden="true">●</span>
            </Badge>
        );

        expect(screen.getByLabelText("3 unread")).toBeInTheDocument();
        expect(screen.getByTestId("badge")).toHaveAttribute("aria-label", "3 unread");
    });

    it("can be hidden when decorative", () => {
        render(
            <Badge
                aria-hidden="true"
                data-testid="decorative-badge"
            >
                Accent
            </Badge>
        );

        expect(screen.getByTestId("decorative-badge")).toHaveAttribute("aria-hidden", "true");
    });

    it("forwards variant scheme and remaining props", () => {
        render(
            <Badge
                className="custom-badge"
                data-testid="badge-root"
                scheme="success"
                variant="outline"
            >
                Success
            </Badge>
        );

        const root = screen.getByTestId("badge-root");
        expect(root).toHaveClass("custom-badge");
        expect(root).toHaveTextContent("Success");
    });
});
