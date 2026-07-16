import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Kbd } from "./index";

describe("Kbd", () => {
    it("renders key label text and is not focusable by default", () => {
        render(
            <Kbd data-testid="kbd">
                Ctrl
            </Kbd>
        );

        const kbd = screen.getByTestId("kbd");

        expect(kbd).toHaveTextContent("Ctrl");
        expect(kbd).not.toHaveAttribute("tabindex");
        expect(kbd.tagName).toBe("DIV");
    });

    it("can render as a native kbd element", () => {
        render(
            <Kbd
                as="kbd"
                data-testid="kbd"
                size="sm"
            >
                Enter
            </Kbd>
        );

        const kbd = screen.getByTestId("kbd");

        expect(kbd.tagName).toBe("KBD");
        expect(kbd).toHaveTextContent("Enter");
    });
});
