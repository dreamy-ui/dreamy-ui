import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as Breadcrumb from "./index";

describe("Breadcrumb", () => {
    it("exposes a named navigation landmark with an ordered list trail", () => {
        render(
            <Breadcrumb.Root aria-label="Breadcrumb">
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/docs/components">Components</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink>Breadcrumb</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        );

        const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
        expect(nav.tagName).toBe("NAV");

        const list = within(nav).getByRole("list");
        expect(list.tagName).toBe("OL");
        expect(within(list).getAllByRole("listitem").length).toBeGreaterThanOrEqual(3);
    });

    it("marks the current page and hides separators and ellipsis from AT", () => {
        render(
            <Breadcrumb.Root aria-label="Breadcrumb">
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator data-testid="separator" />
                    <Breadcrumb.Ellipsis data-testid="ellipsis" />
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        );

        expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");

        const separator = screen.getByTestId("separator");
        expect(separator).toHaveAttribute("role", "presentation");
        expect(separator).toHaveAttribute("aria-hidden", "true");

        const ellipsis = screen.getByTestId("ellipsis");
        expect(ellipsis).toHaveAttribute("role", "presentation");
        expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    });

    it("forwards size and remaining props to the root", () => {
        render(
            <Breadcrumb.Root
                aria-label="Breadcrumb"
                className="custom-breadcrumb"
                data-testid="breadcrumb-root"
                size="sm"
            >
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink>Page</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        );

        const root = screen.getByTestId("breadcrumb-root");
        expect(root).toHaveClass("custom-breadcrumb");
        expect(root).toHaveAttribute("aria-label", "Breadcrumb");
    });
});
