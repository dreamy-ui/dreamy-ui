import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Pagination from "./index";

describe("Pagination", () => {
    it("exposes a named navigation landmark with current page, list, and UI SDK slots", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                defaultPage={1}
                pageSize={10}
                total={100}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
                <Pagination.PageText />
            </Pagination.Root>
        );

        const nav = screen.getByRole("navigation", { name: "Pagination" });
        expect(nav.tagName).toBe("NAV");
        expect(nav).toHaveAttribute("data-slot", "pagination");

        const current = within(nav).getByRole("button", { current: "page" });
        expect(current).toHaveAttribute("aria-current", "page");
        expect(current).toHaveAttribute("data-current");
        expect(current).toHaveAttribute("aria-label", "Page 1");

        expect(screen.getByRole("button", { name: "Previous page" })).toHaveAttribute(
            "aria-disabled",
            "true"
        );
        expect(screen.getByRole("button", { name: "Next page" })).not.toHaveAttribute(
            "aria-disabled",
            "true"
        );
        expect(screen.getByText("1 of 10")).toBeInTheDocument();
    });

    it("calls onPageChange when a page item or next trigger is activated", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination.Root
                aria-label="Pagination"
                defaultPage={1}
                onPageChange={onPageChange}
                pageSize={10}
                total={50}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        await user.click(screen.getByRole("button", { name: "Page 2" }));
        expect(onPageChange).toHaveBeenCalledWith(2, expect.objectContaining({ reason: "item-press" }));

        await user.click(screen.getByRole("button", { name: "Next page" }));
        expect(onPageChange).toHaveBeenCalledWith(3, expect.objectContaining({ reason: "next-press" }));

        expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
            "aria-current",
            "page"
        );
    });

    it("respects the controlled page prop", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        const { rerender } = render(
            <Pagination.Root
                onPageChange={onPageChange}
                page={5}
                pageSize={10}
                total={100}
            >
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute(
            "aria-current",
            "page"
        );

        await user.click(screen.getByRole("button", { name: "Next page" }));
        expect(onPageChange).toHaveBeenCalledWith(6, expect.anything());
        expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute(
            "aria-current",
            "page"
        );

        rerender(
            <Pagination.Root
                onPageChange={onPageChange}
                page={6}
                pageSize={10}
                total={100}
            >
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        expect(screen.getByRole("button", { name: "Page 6" })).toHaveAttribute(
            "aria-current",
            "page"
        );
    });

    it("jumps to the first and last page and marks the matching trigger disabled", async () => {
        const user = userEvent.setup();

        render(
            <Pagination.Root
                defaultPage={5}
                pageSize={10}
                total={100}
            >
                <Pagination.FirstTrigger />
                <Pagination.Items />
                <Pagination.LastTrigger />
            </Pagination.Root>
        );

        await user.click(screen.getByRole("button", { name: "Last page" }));
        expect(screen.getByRole("button", { name: "Page 10" })).toHaveAttribute(
            "aria-current",
            "page"
        );
        expect(screen.getByRole("button", { name: "Last page" })).toHaveAttribute(
            "aria-disabled",
            "true"
        );

        await user.click(screen.getByRole("button", { name: "First page" }));
        expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
            "aria-current",
            "page"
        );
        expect(screen.getByRole("button", { name: "First page" })).toHaveAttribute(
            "aria-disabled",
            "true"
        );
    });

    it("labels the landmark by default and accepts custom translations", () => {
        render(
            <Pagination.Root
                pageSize={10}
                total={30}
                translations={{
                    nextTriggerLabel: "Suivant",
                    itemLabel: ({ page }) => `Aller à la page ${page}`
                }}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Suivant" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Aller à la page 2" })).toBeInTheDocument();
    });

    it("hides ellipsis from AT and disables next on the last page", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                defaultPage={10}
                pageSize={10}
                siblings={1}
                total={100}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        expect(screen.getByRole("button", { name: "Next page" })).toHaveAttribute(
            "aria-disabled",
            "true"
        );
        expect(screen.getByRole("button", { name: "Previous page" })).not.toHaveAttribute(
            "aria-disabled",
            "true"
        );

        const ellipses = document.querySelectorAll('[data-slot="pagination-ellipsis"]');
        expect(ellipses.length).toBeGreaterThan(0);
        expect(ellipses[0]).toHaveAttribute("aria-hidden", "true");
    });

    it("renders anchor links when getHref is provided", () => {
        render(
            <Pagination.Root
                defaultPage={2}
                getHref={(p) => `/posts?page=${p}`}
                pageCount={5}
            >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
            </Pagination.Root>
        );

        const page3 = screen.getByRole("link", { name: "Page 3" });
        expect(page3).toHaveAttribute("href", "/posts?page=3");
    });

    it("forwards size and remaining props to the root", () => {
        render(
            <Pagination.Root
                aria-label="Pagination"
                className="custom-pagination"
                data-testid="pagination-root"
                pageSize={10}
                size="sm"
                total={20}
            >
                <Pagination.Items />
            </Pagination.Root>
        );

        const root = screen.getByTestId("pagination-root");
        expect(root.tagName).toBe("NAV");
        expect(root).toHaveClass("custom-pagination");
    });
});
