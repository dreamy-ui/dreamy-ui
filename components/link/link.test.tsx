import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Link } from "./index";

describe("Link", () => {
    it("renders as an anchor with href and accessible name", () => {
        render(
            <Link
                data-testid="link"
                href="/docs"
            >
                View docs
            </Link>
        );

        const link = screen.getByRole("link", { name: "View docs" });

        expect(link.tagName).toBe("A");
        expect(link).toHaveAttribute("href", "/docs");
        expect(link).not.toHaveAttribute("role", "button");
    });

    it("opens external links in a new tab", () => {
        render(
            <Link
                href="https://dreamy-ui.com"
                isExternal
                rel="noopener noreferrer"
            >
                Dreamy UI
            </Link>
        );

        const link = screen.getByRole("link", { name: "Dreamy UI" });

        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("supports icon-only links with an aria-label", () => {
        render(
            <Link
                aria-label="Open settings"
                href="/settings"
            >
                <span aria-hidden="true">⚙</span>
            </Link>
        );

        expect(screen.getByRole("link", { name: "Open settings" })).toHaveAttribute(
            "href",
            "/settings"
        );
    });
});
