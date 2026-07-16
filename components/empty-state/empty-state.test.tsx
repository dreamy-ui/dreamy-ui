import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as EmptyState from "./index";

describe("EmptyState", () => {
    it("renders a semantic heading title and description", () => {
        render(
            <EmptyState.Root data-testid="empty-root">
                <EmptyState.Content>
                    <EmptyState.Title>No results</EmptyState.Title>
                    <EmptyState.Description>Try a different search.</EmptyState.Description>
                </EmptyState.Content>
            </EmptyState.Root>
        );

        expect(screen.getByTestId("empty-root").tagName).toBe("DIV");
        expect(screen.getByRole("heading", { level: 3, name: "No results" })).toBeInTheDocument();
        expect(screen.getByText("Try a different search.")).toBeInTheDocument();
        expect(screen.getByText("Try a different search.").tagName).toBe("P");
    });

    it("allows adjusting the title heading level", () => {
        render(
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Title as="h2">Empty inbox</EmptyState.Title>
                </EmptyState.Content>
            </EmptyState.Root>
        );

        expect(screen.getByRole("heading", { level: 2, name: "Empty inbox" })).toBeInTheDocument();
    });

    it("keeps a decorative indicator graphic aria-hidden", () => {
        render(
            <EmptyState.Root size="sm">
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <svg
                            aria-hidden="true"
                            data-testid="indicator-icon"
                        />
                    </EmptyState.Indicator>
                    <EmptyState.Title>Cart is empty</EmptyState.Title>
                </EmptyState.Content>
            </EmptyState.Root>
        );

        expect(screen.getByTestId("indicator-icon")).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("heading", { name: "Cart is empty" })).toBeInTheDocument();
    });
});
