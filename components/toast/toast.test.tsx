import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToast } from "@dreamy-ui/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { ToastProvider } from "../toast-provider";

function ToastHarness({
    onReady
}: {
    onReady: (api: ReturnType<typeof useToast>) => void;
}) {
    const api = useToast();
    onReady(api);
    return (
        <button
            onClick={() =>
                api.toast({
                    title: "Saved",
                    description: "Your changes were saved.",
                    status: "success",
                    duration: Number.POSITIVE_INFINITY,
                    isClosable: true
                })
            }
            type="button"
        >
            Show toast
        </button>
    );
}

describe("Toast", () => {
    it("announces non-urgent toasts with role=status live semantics", async () => {
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <ToastHarness onReady={() => {}} />
            </ToastProvider>
        );

        await user.click(screen.getByRole("button", { name: "Show toast" }));

        const status = await waitFor(() => {
            const node =
                screen.queryByRole("status") ??
                document.body.querySelector('[role="status"]');
            expect(node).toBeTruthy();
            return node as HTMLElement;
        });

        expect(status).toHaveTextContent("Saved");
        expect(status).toHaveTextContent("Your changes were saved.");
        expect(status).not.toHaveAttribute("aria-modal");
    });

    it("uses role=alert for error / urgent toasts", async () => {
        function ErrorToastButton() {
            const { toast } = useToast();
            return (
                <button
                    onClick={() =>
                        toast({
                            title: "Failed",
                            description: "Something went wrong.",
                            status: "error",
                            duration: Number.POSITIVE_INFINITY
                        })
                    }
                    type="button"
                >
                    Show error
                </button>
            );
        }

        const user = userEvent.setup();
        render(
            <ToastProvider>
                <ErrorToastButton />
            </ToastProvider>
        );

        await user.click(screen.getByRole("button", { name: "Show error" }));

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent("Failed");
        });
    });

    it("renders a named Close control when isClosable and removes the toast", async () => {
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <ToastHarness onReady={() => {}} />
            </ToastProvider>
        );

        await user.click(screen.getByRole("button", { name: "Show toast" }));
        await waitFor(() => {
            expect(screen.getByText("Saved")).toBeInTheDocument();
        });

        const close = screen.getByRole("button", { name: "Close" });
        fireEvent.click(close);

        await waitFor(() => {
            expect(screen.queryByText("Saved")).not.toBeInTheDocument();
        });
    });

    it("does not move focus into the toast when it appears", async () => {
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <ToastHarness onReady={() => {}} />
            </ToastProvider>
        );

        const trigger = screen.getByRole("button", { name: "Show toast" });
        trigger.focus();
        await user.click(trigger);

        await waitFor(() => {
            expect(screen.getByText("Saved")).toBeInTheDocument();
        });
        expect(trigger).toHaveFocus();
    });

    it("marks status icons as decorative / non-noisy", async () => {
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <ToastHarness onReady={() => {}} />
            </ToastProvider>
        );

        await user.click(screen.getByRole("button", { name: "Show toast" }));
        await waitFor(() => {
            expect(screen.getByText("Saved")).toBeInTheDocument();
        });

        const icon = document.body.querySelector("[data-part='icon']");
        expect(icon).toBeTruthy();
        expect(
            icon?.getAttribute("aria-hidden") === "true" ||
                icon?.querySelector("[aria-hidden='true']") != null
        ).toBe(true);
    });

    it("supports custom render without becoming a modal dialog", async () => {
        function CustomToastButton() {
            const { toast } = useToast();
            return (
                <button
                    onClick={() =>
                        toast({
                            duration: Number.POSITIVE_INFINITY,
                            render: () => <div data-testid="custom-toast">Custom message</div>
                        })
                    }
                    type="button"
                >
                    Custom
                </button>
            );
        }

        const user = userEvent.setup();
        render(
            <ToastProvider>
                <CustomToastButton />
            </ToastProvider>
        );

        await user.click(screen.getByRole("button", { name: "Custom" }));
        expect(await screen.findByTestId("custom-toast")).toHaveTextContent("Custom message");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
