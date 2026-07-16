import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Icon } from "./index";

describe("Icon", () => {
    it("supports decorative icons with aria-hidden", () => {
        render(
            <Icon
                aria-hidden="true"
                data-testid="icon"
                focusable="false"
                size="md"
            >
                <path d="M0 0h24v24H0z" />
            </Icon>
        );

        const icon = screen.getByTestId("icon");

        expect(icon.tagName).toBe("svg");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveAttribute("focusable", "false");
    });

    it("supports meaningful standalone icons with an accessible name", () => {
        render(
            <Icon
                aria-label="Warning"
                data-testid="icon"
                role="img"
                size="lg"
            >
                <path d="M12 2l9 20H3z" />
            </Icon>
        );

        const icon = screen.getByTestId("icon");

        expect(icon).toHaveAttribute("aria-label", "Warning");
        expect(icon).toHaveAttribute("role", "img");
    });
});
