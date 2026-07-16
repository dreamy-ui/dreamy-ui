import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as List from "./index";

describe("List", () => {
    it("renders an unordered list by default", () => {
        render(
            <List.Root data-testid="list-root">
                <List.Item>Alpha</List.Item>
                <List.Item>Beta</List.Item>
                <List.Item>Gamma</List.Item>
            </List.Root>
        );

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("UL");
        expect(list).toHaveAttribute("data-type", "unordered");
        expect(within(list).getAllByRole("listitem")).toHaveLength(3);
        expect(within(list).getByText("Alpha").tagName).toBe("LI");
    });

    it("renders an ordered list when ordered is set", () => {
        render(
            <List.Root ordered>
                <List.Item>First</List.Item>
                <List.Item>Second</List.Item>
            </List.Root>
        );

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
        expect(list).toHaveAttribute("data-type", "ordered");
        expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });

    it("forwards remaining props to the root", () => {
        render(
            <List.Root
                aria-label="Hardware"
                className="custom-list"
                data-testid="list-root"
            >
                <List.Item>CPU</List.Item>
            </List.Root>
        );

        const root = screen.getByTestId("list-root");
        expect(root).toHaveClass("custom-list");
        expect(root).toHaveAttribute("aria-label", "Hardware");
    });
});
