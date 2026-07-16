import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Pagination from "./index";

describe("Pagination", () => {
    it("exposes a named navigation landmark with current page and named controls", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                count={100}
                defaultPage={1}
                pageSize={10}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
                <Pagination.PageText />
            </Pagination.Root>
        );

        const nav = screen.getByRole("navigation", { name: "Pagination" });
        expect(nav.tagName).toBe("NAV");

        const current = within(nav).getByRole("button", { current: "page" });
        expect(current).toHaveAttribute("aria-current", "page");
        expect(current).toHaveAttribute("aria-label", "Page 1");

        expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();
        expect(screen.getByText("1 of 10")).toBeInTheDocument();
    });

    it("calls onPageChange when a page item or next trigger is activated", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination.Root
                aria-label="Pagination"
                count={50}
                defaultPage={1}
                onPageChange={onPageChange}
                pageSize={10}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        await user.click(screen.getByRole("button", { name: "Page 2" }));
        expect(onPageChange).toHaveBeenCalledWith({ page: 2 });

        await user.click(screen.getByRole("button", { name: "Next page" }));
        expect(onPageChange).toHaveBeenCalledWith({ page: 3 });
    });

    it("hides ellipsis from AT and disables next on the last page", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                count={100}
                defaultPage={10}
                pageSize={10}
                siblingCount={1}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();

        const ellipses = document.querySelectorAll("[aria-hidden='true']");
        expect(ellipses.length).toBeGreaterThan(0);
    });

    it("forwards size and remaining props to the root", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                className="custom-pagination"
                count={20}
                data-testid="pagination-root"
                pageSize={10}
                size="sm"
            >
                <Pagination.Items />
            </Pagination.Root>
        );

        const root = screen.getByTestId("pagination-root");
        expect(root.tagName).toBe("NAV");
        expect(root).toHaveClass("custom-pagination");
    });
});
