import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as Card from "./index";

describe("Card", () => {
    it("renders a presentational card with semantic title and description", () => {
        render(
            <Card.Root data-testid="card-root">
                <Card.Header>
                    <Card.Title>Project overview</Card.Title>
                    <Card.Description>Summary of the latest release.</Card.Description>
                </Card.Header>
                <Card.Body>Body content</Card.Body>
                <Card.Footer>Footer actions</Card.Footer>
            </Card.Root>
        );

        const root = screen.getByTestId("card-root");

        expect(root.tagName).toBe("DIV");
        expect(root).not.toHaveAttribute("role");
        expect(screen.getByRole("heading", { level: 3, name: "Project overview" })).toBeInTheDocument();
        expect(screen.getByText("Summary of the latest release.").tagName).toBe("P");
        expect(screen.getByText("Body content")).toBeInTheDocument();
        expect(screen.getByText("Footer actions")).toBeInTheDocument();
    });

    it("allows adjusting the title heading level", () => {
        render(
            <Card.Root>
                <Card.Header>
                    <Card.Title as="h2">Section card</Card.Title>
                </Card.Header>
            </Card.Root>
        );

        expect(screen.getByRole("heading", { level: 2, name: "Section card" })).toBeInTheDocument();
    });

    it("supports size and variant props on the root", () => {
        render(
            <Card.Root
                data-testid="card-root"
                size="sm"
                variant="elevated"
            >
                <Card.Body>Elevated</Card.Body>
            </Card.Root>
        );

        expect(screen.getByTestId("card-root")).toBeInTheDocument();
        expect(screen.getByText("Elevated")).toBeInTheDocument();
    });
});
