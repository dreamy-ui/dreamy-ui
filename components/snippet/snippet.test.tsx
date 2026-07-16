import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Snippet from "./index";

describe("Snippet", () => {
    it("exposes code text and a named copy button with decorative icons", async () => {
        const user = userEvent.setup();
        const onCopy = vi.fn();

        render(
            <Snippet.Root
                data-testid="snippet"
                onCopy={onCopy}
            >
                <Snippet.Header>Terminal</Snippet.Header>
                <Snippet.Body>pnpm dreamy add snippet</Snippet.Body>
            </Snippet.Root>
        );

        expect(screen.getByLabelText("Snippet")).toBeInTheDocument();
        expect(screen.getByText("pnpm dreamy add snippet")).toBeInTheDocument();
        expect(screen.getByText("pnpm dreamy add snippet").closest("code")).toBeInTheDocument();

        const copyButton = screen.getByRole("button", { name: "Copy" });
        expect(copyButton.querySelector("svg")).toHaveAttribute("aria-hidden", "true");

        await user.click(copyButton);
        expect(onCopy).toHaveBeenCalledWith("pnpm dreamy add snippet");
    });

    it("marks the default header icon as decorative", () => {
        render(
            <Snippet.Root>
                <Snippet.Header>Shell</Snippet.Header>
                <Snippet.Body>echo hello</Snippet.Body>
            </Snippet.Root>
        );

        const header = screen.getByLabelText("Snippet");
        const headerIcon = header.querySelector("svg");

        expect(headerIcon).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByText("Shell")).toBeInTheDocument();
    });

    it("can hide the copy button and accept size", () => {
        render(
            <Snippet.Root size="sm">
                <Snippet.Header hideCopyButton>README</Snippet.Header>
                <Snippet.Body>export default</Snippet.Body>
            </Snippet.Root>
        );

        expect(screen.queryByRole("button", { name: "Copy" })).not.toBeInTheDocument();
        expect(screen.getByText("export default")).toBeInTheDocument();
    });
});
