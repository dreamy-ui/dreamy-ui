import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToast } from "@dreamy-ui/react";
import { useEffect, useRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { ToastProvider } from "./index";

function EmitToast({
    payload
}: {
    payload: Parameters<ReturnType<typeof useToast>["toast"]>[0];
}) {
    const { toast } = useToast();
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        toast(payload);
    }, [toast, payload]);

    return null;
}

describe("ToastProvider", () => {
    it("provides useToast and portals visible toasts into the document body", async () => {
        render(
            <ToastProvider>
                <EmitToast
                    payload={{
                        title: "Hello",
                        status: "info",
                        duration: Number.POSITIVE_INFINITY
                    }}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Hello")).toBeInTheDocument();
        });

        const toastNode = screen.getByText("Hello").closest("[id]") ?? screen.getByText("Hello");
        expect(document.body.contains(toastNode)).toBe(true);
        expect(toastNode.closest("[aria-hidden='true']")).toBeNull();
    });

    it("applies defaultToastProps to created toasts", async () => {
        render(
            <ToastProvider
                defaultToastProps={{
                    status: "warning",
                    position: "top-left",
                    isClosable: true,
                    duration: Number.POSITIVE_INFINITY
                }}
            >
                <EmitToast payload={{ title: "Defaulted" }} />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Defaulted")).toBeInTheDocument();
        });

        const root =
            screen.getByText("Defaulted").closest("[data-status]") ??
            document.body.querySelector("[data-status='warning']");
        expect(root).toHaveAttribute("data-status", "warning");
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("supports updateToast and removeToast", async () => {
        let api: ReturnType<typeof useToast> | null = null;

        function Capture() {
            api = useToast();
            return null;
        }

        render(
            <ToastProvider>
                <Capture />
            </ToastProvider>
        );

        let id = "";
        act(() => {
            id = api!.toast({
                title: "Original",
                duration: Number.POSITIVE_INFINITY
            });
        });

        await waitFor(() => {
            expect(screen.getByText("Original")).toBeInTheDocument();
        });

        act(() => {
            api!.updateToast(id, { title: "Updated" });
        });

        await waitFor(() => {
            expect(screen.getByText("Updated")).toBeInTheDocument();
        });

        act(() => {
            api!.removeToast(id);
        });

        await waitFor(() => {
            expect(screen.queryByText("Updated")).not.toBeInTheDocument();
        });
    });

    it("exposes pauseToast and resumeToast on the provider context", () => {
        let api: ReturnType<typeof useToast> | null = null;

        function Capture() {
            api = useToast();
            return null;
        }

        render(
            <ToastProvider>
                <Capture />
            </ToastProvider>
        );

        expect(typeof api!.pauseToast).toBe("function");
        expect(typeof api!.resumeToast).toBe("function");

        let id = "";
        act(() => {
            id = api!.toast({
                title: "Pausable",
                duration: Number.POSITIVE_INFINITY
            });
        });

        expect(() => {
            api!.pauseToast(id);
            api!.resumeToast(id);
        }).not.toThrow();
    });

    it("does not create a focus trap around the toast manager", async () => {
        const user = userEvent.setup();

        render(
            <ToastProvider>
                <button type="button">Before</button>
                <EmitToast
                    payload={{
                        title: "No trap",
                        duration: Number.POSITIVE_INFINITY
                    }}
                />
                <button type="button">After</button>
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("No trap")).toBeInTheDocument();
        });

        await user.tab();
        expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
});
