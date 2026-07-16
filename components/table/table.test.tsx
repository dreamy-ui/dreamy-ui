import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as Table from "./index";

describe("Table", () => {
    it("renders native table semantics with column headers and caption", () => {
        render(
            <Table.Root>
                <Table.Table>
                    <Table.Caption>User directory</Table.Caption>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Age</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Ada</Table.Cell>
                            <Table.Cell>36</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Table>
            </Table.Root>
        );

        const table = screen.getByRole("table", { name: "User directory" });
        expect(table.tagName).toBe("TABLE");

        const columnHeaders = within(table).getAllByRole("columnheader");
        expect(columnHeaders).toHaveLength(2);
        expect(columnHeaders[0].tagName).toBe("TH");
        expect(columnHeaders[0]).toHaveTextContent("Name");

        expect(within(table).getByRole("cell", { name: "Ada" }).tagName).toBe("TD");
        expect(within(table).getByRole("row", { name: /Ada/ })).toBeInTheDocument();
    });

    it("supports variant size and scheme props on the root", () => {
        render(
            <Table.Root
                className="custom-table"
                data-testid="table-root"
                scheme="primary"
                size="sm"
                variant="line"
            >
                <Table.Table aria-label="Scores">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Score</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>10</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Table>
            </Table.Root>
        );

        const root = screen.getByTestId("table-root");
        expect(root).toHaveClass("custom-table");
        expect(screen.getByRole("table", { name: "Scores" })).toBeInTheDocument();
    });
});
