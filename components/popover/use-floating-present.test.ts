import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFloatingPresent } from "./use-floating-present";

describe("useFloatingPresent", () => {
    it("keeps present true on the first render after open becomes false", () => {
        const { result, rerender } = renderHook(
            ({ open }: { open: boolean }) => useFloatingPresent(open, false),
            { initialProps: { open: true } }
        );

        expect(result.current.present).toBe(true);

        rerender({ open: false });

        expect(result.current.present).toBe(true);
    });

    it("clears present after handleExitComplete", () => {
        const { result, rerender } = renderHook(
            ({ open }: { open: boolean }) => useFloatingPresent(open, false),
            { initialProps: { open: true } }
        );

        rerender({ open: false });
        expect(result.current.present).toBe(true);

        result.current.handleExitComplete();
        rerender({ open: false });

        expect(result.current.present).toBe(false);
    });
});
