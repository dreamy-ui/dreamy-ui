"use client";

import { createStyleContext } from "styled-system/jsx";
import { type TableVariantProps, table } from "styled-system/recipes";
import { type DreamyComponent, type HTMLDreamyProps, dreamy } from "./factory";

const { withContext, withProvider } = createStyleContext(table);

export interface TableRootProps extends HTMLDreamyProps<"div">, TableVariantProps {}

/**
 * Table component
 *
 * @See Docs https://dreamy-ui.com/docs/components/table
 */
const TableRoot = withProvider<DreamyComponent<"div", TableRootProps>>(dreamy.div, "root");

export interface TableTableProps extends HTMLDreamyProps<"table"> {}
const TableTable = withContext<DreamyComponent<"table", TableTableProps>>(dreamy.table, "table");

export interface TableHeaderProps extends HTMLDreamyProps<"thead"> {}
const TableHeader = withContext<DreamyComponent<"thead", TableHeaderProps>>(dreamy.thead, "header");

export interface TableBodyProps extends HTMLDreamyProps<"tbody"> {}
const TableBody = withContext<DreamyComponent<"tbody", TableBodyProps>>(dreamy.tbody, "body");

export interface TableRowProps extends HTMLDreamyProps<"tr"> {}
const TableRow = withContext<DreamyComponent<"tr", TableRowProps>>(dreamy.tr, "row");

export interface TableCellProps extends HTMLDreamyProps<"td"> {}
const TableCell = withContext<DreamyComponent<"td", TableCellProps>>(dreamy.td, "cell");

export interface TableColumnHeaderProps extends HTMLDreamyProps<"th"> {}
const TableColumnHeader = withContext<DreamyComponent<"th", TableColumnHeaderProps>>(
    dreamy.th,
    "columnHeader"
);

export interface TableCaptionProps extends HTMLDreamyProps<"caption"> {}
const TableCaption = withContext<DreamyComponent<"caption", TableCaptionProps>>(
    dreamy.caption,
    "caption"
);

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
