import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Grid, GridItem } from "./index";

describe("Grid", () => {
    it("renders children", () => {
        render(
            <Grid columns={2}>
                <GridItem>One</GridItem>
                <GridItem>Two</GridItem>
            </Grid>
        );

        expect(screen.getByText("One")).toBeInTheDocument();
        expect(screen.getByText("Two")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Grid
                className="custom-grid"
                data-testid="grid-root"
                gap={4}
                columns={3}
            >
                <span>Cell</span>
            </Grid>
        );

        const root = screen.getByTestId("grid-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-grid");
        expect(root).not.toHaveAttribute("role");
    });
});

describe("GridItem", () => {
    it("forwards props and renders children", () => {
        render(
            <GridItem
                data-testid="grid-item"
                className="custom-item"
                colSpan={2}
            >
                Item content
            </GridItem>
        );

        const item = screen.getByTestId("grid-item");

        expect(item.tagName).toBe("DIV");
        expect(item).toHaveClass("custom-item");
        expect(screen.getByText("Item content")).toBeInTheDocument();
    });
});
