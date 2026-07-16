import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as DatePicker from "./index";

describe("DatePicker", () => {
    it("opens a labelled calendar grid with nav and full-date day names", async () => {
        const user = userEvent.setup();

        render(
            <DatePicker.Root
                defaultValue={new Date(2026, 0, 15)}
                popoverProps={{ usePortal: false }}
            >
                <DatePicker.Input />
                <DatePicker.PopoverContent>
                    <DatePicker.Header />
                    <DatePicker.Calendar />
                </DatePicker.PopoverContent>
            </DatePicker.Root>
        );

        await user.click(screen.getByPlaceholderText("Select date"));

        await waitFor(function assertGrid() {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Thursday, January 15, 2026" })
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Select date")).toHaveValue("Jan 15, 2026");
    });

    it("gets its accessible name from Field.Label", () => {
        render(
            <Field.Root>
                <Field.Label>Start date</Field.Label>
                <DatePicker.Root popoverProps={{ usePortal: false }}>
                    <DatePicker.Input />
                    <DatePicker.PopoverContent>
                        <DatePicker.Header />
                        <DatePicker.Calendar />
                    </DatePicker.PopoverContent>
                </DatePicker.Root>
            </Field.Root>
        );

        expect(screen.getByPlaceholderText("Select date")).toHaveAccessibleName(/Start date/i);
    });

    it("closes on Escape and restores focus to the trigger input", async () => {
        const user = userEvent.setup();

        render(
            <DatePicker.Root popoverProps={{ usePortal: false }}>
                <DatePicker.Input />
                <DatePicker.PopoverContent>
                    <DatePicker.Header />
                    <DatePicker.Calendar />
                </DatePicker.PopoverContent>
            </DatePicker.Root>
        );

        const input = screen.getByPlaceholderText("Select date");
        await user.click(input);

        await waitFor(function assertOpen() {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        await user.keyboard("{Escape}");

        await waitFor(function assertClosed() {
            expect(screen.queryByRole("grid")).not.toBeInTheDocument();
        });
        expect(input).toHaveFocus();
    });

    it("selects a day with pointer activation", async () => {
        const user = userEvent.setup();

        render(
            <DatePicker.Root
                defaultValue={new Date(2026, 6, 16)}
                popoverProps={{ usePortal: false }}
            >
                <DatePicker.Input />
                <DatePicker.PopoverContent>
                    <DatePicker.Header />
                    <DatePicker.Calendar />
                </DatePicker.PopoverContent>
            </DatePicker.Root>
        );

        await user.click(screen.getByPlaceholderText("Select date"));

        await waitFor(function assertOpen() {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: "Friday, July 17, 2026" }));

        await waitFor(function assertValue() {
            expect(screen.getByPlaceholderText("Select date")).toHaveValue("Jul 17, 2026");
        });
    });

    it("disables out-of-range days via minDate/maxDate", async () => {
        const user = userEvent.setup();

        render(
            <DatePicker.Root
                defaultValue={new Date(2026, 0, 15)}
                maxDate={new Date(2026, 0, 20)}
                minDate={new Date(2026, 0, 10)}
                popoverProps={{ usePortal: false }}
            >
                <DatePicker.Input />
                <DatePicker.PopoverContent>
                    <DatePicker.Header />
                    <DatePicker.Calendar />
                </DatePicker.PopoverContent>
            </DatePicker.Root>
        );

        await user.click(screen.getByPlaceholderText("Select date"));

        await waitFor(function assertOpen() {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: "Friday, January 9, 2026" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Wednesday, January 21, 2026" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Thursday, January 15, 2026" })
        ).not.toBeDisabled();
    });
});
