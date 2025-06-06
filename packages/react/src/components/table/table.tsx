import type { HTMLDreamProps } from "@/utils/types";
import { table } from "styled-system/recipes";
import { dreamy } from "../factory";
import { createStyleContext } from "../style-context";

const { withContext, withProvider } = createStyleContext(table);

export interface TableProps extends HTMLDreamProps<"table"> {}
/**
 * Table component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/table
 */
export const TableContainer = withProvider(dreamy.div, "root");
export const Table = withContext(dreamy.table, "table");
export const TableHeader = withContext(dreamy.thead, "header");
export const TableBody = withContext(dreamy.tbody, "body");
export const TableRow = withContext(dreamy.tr, "row");
export const TableCell = withContext(dreamy.td, "cell");
export const TableColumnHeader = withContext(dreamy.th, "columnHeader");
export const TableCaption = withContext(dreamy.caption, "caption");
