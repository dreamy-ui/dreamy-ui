"use client";

import {
    type DreamyComponent,
    type HTMLDreamyProps,
    createStyleContext,
    dreamy
} from "styled-system/jsx";
import { type TableVariantProps, table } from "styled-system/recipes";

const { withContext, withProvider } = createStyleContext(table);

export interface TableRootProps extends HTMLDreamyProps<"div">, TableVariantProps {}

/**
 * Table component
 *
 * @See Docs https://dreamy-ui.com/docs/components/table
 */
export const Root = withProvider<DreamyComponent<"div", TableRootProps>>(dreamy.div, "root");

export interface TableTableProps extends HTMLDreamyProps<"table"> {}
export const Table = withContext<DreamyComponent<"table", TableTableProps>>(dreamy.table, "table");

export interface TableHeaderProps extends HTMLDreamyProps<"thead"> {}
export const Header = withContext<DreamyComponent<"thead", TableHeaderProps>>(
    dreamy.thead,
    "header"
);

export interface TableBodyProps extends HTMLDreamyProps<"tbody"> {}
export const Body = withContext<DreamyComponent<"tbody", TableBodyProps>>(dreamy.tbody, "body");

export interface TableRowProps extends HTMLDreamyProps<"tr"> {}
export const Row = withContext<DreamyComponent<"tr", TableRowProps>>(dreamy.tr, "row");

export interface TableCellProps extends HTMLDreamyProps<"td"> {}
export const Cell = withContext<DreamyComponent<"td", TableCellProps>>(dreamy.td, "cell");

export interface TableColumnHeaderProps extends HTMLDreamyProps<"th"> {}
export const ColumnHeader = withContext<DreamyComponent<"th", TableColumnHeaderProps>>(
    dreamy.th,
    "columnHeader"
);

export interface TableCaptionProps extends HTMLDreamyProps<"caption"> {}
export const Caption = withContext<DreamyComponent<"caption", TableCaptionProps>>(
    dreamy.caption,
    "caption"
);
