"use client";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type TableVariantProps, table } from "styled-system/recipes";

const { withContext, withProvider } = createStyleContext(table);

export interface TableRootProps extends HTMLDreamyProps<"div">, TableVariantProps {}

/**
 * Table component
 *
 * @See Docs https://dreamy-ui.com/docs/components/table
 */
export const Root = withProvider(dreamy.div, "root");

export interface TableTableProps extends HTMLDreamyProps<"table"> {}
export const Table = withContext(dreamy.table, "table");

export interface TableHeaderProps extends HTMLDreamyProps<"thead"> {}
export const Header = withContext(dreamy.thead, "header");

export interface TableBodyProps extends HTMLDreamyProps<"tbody"> {}
export const Body = withContext(dreamy.tbody, "body");

export interface TableRowProps extends HTMLDreamyProps<"tr"> {}
export const Row = withContext(dreamy.tr, "row");

export interface TableCellProps extends HTMLDreamyProps<"td"> {}
export const Cell = withContext(dreamy.td, "cell");

export interface TableColumnHeaderProps extends HTMLDreamyProps<"th"> {}
export const ColumnHeader = withContext(dreamy.th, "columnHeader");

export interface TableCaptionProps extends HTMLDreamyProps<"caption"> {}
export const Caption = withContext(dreamy.caption, "caption");
