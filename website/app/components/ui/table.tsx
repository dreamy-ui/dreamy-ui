"use client";

import { createStyleContext } from "styled-system/jsx";
import { table } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";

const { withContext, withProvider } = createStyleContext(table);

export interface TableProps extends HTMLDreamyProps<"table"> {}

/**
 * Table component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/table
 */
const TableRoot = withProvider(dreamy.div, "root");
const TableTable = withContext(dreamy.table, "table");
const TableHeader = withContext(dreamy.thead, "header");
const TableBody = withContext(dreamy.tbody, "body");
const TableRow = withContext(dreamy.tr, "row");
const TableCell = withContext(dreamy.td, "cell");
const TableColumnHeader = withContext(dreamy.th, "columnHeader");
const TableCaption = withContext(dreamy.caption, "caption");

export namespace Table {
    export const Root = TableRoot;
    export const Table = TableTable;
    export const Header = TableHeader;
    export const Body = TableBody;
    export const Row = TableRow;
    export const Cell = TableCell;
    export const ColumnHeader = TableColumnHeader;
    export const Caption = TableCaption;
}
