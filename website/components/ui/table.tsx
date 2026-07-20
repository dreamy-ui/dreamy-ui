"use client";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type TableVariantProps, table } from "styled-system/recipes";

const { withContext, withProvider } = createStyleContext(table);

export interface TableRootProps extends HTMLDreamyProps<"div">, TableVariantProps {}

/**
 * Table component — accessible data table layout.
 *
 * @see Docs https://dreamy-ui.com/docs/components/table
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.Table>
 *     <Table.Header>
 *       <Table.Row>
 *         <Table.ColumnHeader>Name</Table.ColumnHeader>
 *       </Table.Row>
 *     </Table.Header>
 *     <Table.Body>
 *       <Table.Row>
 *         <Table.Cell>Ada</Table.Cell>
 *       </Table.Row>
 *     </Table.Body>
 *   </Table.Table>
 * </Table.Root>
 * ```
 */
export const Root = withProvider(dreamy.div, "root");

export interface TableTableProps extends HTMLDreamyProps<"table"> {}

/**
 * Table Table — native `<table>` element.
 */
export const Table = withContext(dreamy.table, "table");

export interface TableHeaderProps extends HTMLDreamyProps<"thead"> {}

/**
 * Table Header — table head section.
 */
export const Header = withContext(dreamy.thead, "header");

export interface TableBodyProps extends HTMLDreamyProps<"tbody"> {}

/**
 * Table Body — table body section.
 */
export const Body = withContext(dreamy.tbody, "body");

export interface TablePropsProps extends HTMLDreamyProps<"tr"> {}

/**
 * Table Row — a single table row.
 */
export const Row = withContext(dreamy.tr, "row");

export interface TableCellProps extends HTMLDreamyProps<"td"> {}

/**
 * Table Cell — a data cell.
 */
export const Cell = withContext(dreamy.td, "cell");

export interface TableColumnHeaderProps extends HTMLDreamyProps<"th"> {}

/**
 * Table ColumnHeader — a header cell.
 */
export const ColumnHeader = withContext(dreamy.th, "columnHeader");

export interface TableCaptionProps extends HTMLDreamyProps<"caption"> {}

/**
 * Table Caption — accessible table caption.
 */
export const Caption = withContext(dreamy.caption, "caption");
