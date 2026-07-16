import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as Autocomplete from "./index";

const cities = [
    { value: "nyc", label: "New York" },
    { value: "ldn", label: "London" },
    { value: "tyo", label: "Tokyo" }
];

describe("Autocomplete", () => {
    it("exposes a combobox input with listbox popup state", async () => {
        const user = userEvent.setup();

        render(
            <Field.Root>
                <Field.Label>City</Field.Label>
                <Autocomplete.Root
                    items={cities}
                    popoverProps={{ usePortal: false }}
                >
                    <Autocomplete.Input placeholder="Search…" />
                    <Autocomplete.Content />
                </Autocomplete.Root>
            </Field.Root>
        );

        const input = screen.getByRole("combobox", { name: "City" });

        expect(input).toHaveAttribute("aria-haspopup", "listbox");
        expect(input).toHaveAttribute("aria-expanded", "false");
        expect(input).toHaveAttribute("autocomplete", "off");

        await user.click(input);

        expect(input).toHaveAttribute("aria-expanded", "true");
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("renders suggestion items when open", async () => {
        const user = userEvent.setup();

        render(
            <Autocomplete.Root
                items={cities}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        );

        await user.click(screen.getByRole("combobox", { name: "City" }));

        expect(await screen.findByText("New York")).toBeInTheDocument();
        expect(screen.getByText("London")).toBeInTheDocument();
        expect(screen.getByText("Tokyo")).toBeInTheDocument();
    });

    it("filters options and selects with Enter", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Autocomplete.Root
                items={cities}
                onChangeValue={onChangeValue}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        );

        const input = screen.getByRole("combobox", { name: "City" });

        await user.click(input);
        await user.type(input, "Lon");

        expect(await screen.findByRole("option", { name: "London" })).toBeInTheDocument();

        await user.click(screen.getByRole("option", { name: "London" }));

        await waitFor(function waitForSelect() {
            expect(onChangeValue).toHaveBeenCalledWith("ldn");
        });
    });

    it("closes the listbox on Escape while keeping focus on the input", async () => {
        const user = userEvent.setup();

        render(
            <Autocomplete.Root
                items={cities}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        );

        const input = screen.getByRole("combobox", { name: "City" });

        await user.click(input);
        expect(input).toHaveAttribute("aria-expanded", "true");

        await user.keyboard("{Escape}");

        await waitFor(function waitForClose() {
            expect(input).toHaveAttribute("aria-expanded", "false");
        });
        expect(input).toHaveFocus();
    });

    it("shows empty results text when nothing matches", async () => {
        const user = userEvent.setup();

        render(
            <Autocomplete.Root
                items={cities}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content noResultsText="No cities found" />
            </Autocomplete.Root>
        );

        await user.type(screen.getByRole("combobox", { name: "City" }), "zzz");

        expect(await screen.findByText("No cities found")).toBeInTheDocument();
    });

    it("wires Field invalid onto the combobox input", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>City</Field.Label>
                <Autocomplete.Root
                    items={cities}
                    popoverProps={{ usePortal: false }}
                >
                    <Autocomplete.Input placeholder="Search…" />
                    <Autocomplete.Content />
                </Autocomplete.Root>
                <Field.Error>Select a city.</Field.Error>
            </Field.Root>
        );

        const input = screen.getByRole("combobox", { name: "City" });

        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("exposes a named clear button when clearable and selected", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Autocomplete.Root
                defaultValue="nyc"
                isClearable
                items={cities}
                onChangeValue={onChangeValue}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        );

        const clear = screen.getByRole("button", { name: /clear/i });

        await user.click(clear);

        expect(onChangeValue).toHaveBeenCalledWith(null);
    });

    it("marks decorative indicators as aria-hidden", () => {
        render(
            <Autocomplete.Root
                items={cities}
                popoverProps={{ usePortal: false }}
            >
                <Autocomplete.Input
                    aria-label="City"
                    placeholder="Search…"
                />
                <Autocomplete.Content />
            </Autocomplete.Root>
        );

        const svgs = document.querySelectorAll("svg[aria-hidden='true']");

        expect(svgs.length).toBeGreaterThan(0);
    });
});
