import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Divider } from "./index";

describe("Divider", () => {
    it("renders as an hr separator", () => {
        render(<Divider data-testid="divider" />);

        const divider = screen.getByRole("separator");

        expect(divider.tagName).toBe("HR");
        expect(divider).toBe(screen.getByTestId("divider"));
    });

    it("forwards props to the hr element", () => {
        render(
            <Divider
                className="custom-divider"
                data-testid="divider"
                orientation="vertical"
                thickness="2px"
            />
        );

        const divider = screen.getByTestId("divider");

        expect(divider.tagName).toBe("HR");
        expect(divider).toHaveClass("custom-divider");
        expect(screen.getByRole("separator")).toBe(divider);
    });

    it("supports horizontal orientation between content", () => {
        render(
            <>
                <p>Above</p>
                <Divider orientation="horizontal" />
                <p>Below</p>
            </>
        );

        expect(screen.getByRole("separator")).toBeInTheDocument();
        expect(screen.getByText("Above")).toBeInTheDocument();
        expect(screen.getByText("Below")).toBeInTheDocument();
    });
});
