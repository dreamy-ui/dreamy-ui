import type { HTMLDreamProps } from "@/utils/types";
import { table } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import { createStyleContext } from "../style-context";

const { withContext, withProvider } = createStyleContext(table);

const StyledTable = dreamy.table;
const StyledWrapper = dreamy.div;

const Wrapper = withContext(StyledWrapper, "wrapper");

export interface TableProps extends HTMLDreamProps<"table"> {}

const TableBase = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
    return (
        <Wrapper>
            <StyledTable
                {...props}
                ref={ref}
            />
        </Wrapper>
    );
});

/**
 * Table component.
 *
 * @See Docs https://dream-ui.com/docs/components/table
 */
export const Table = withProvider(TableBase, "root");
export const TableHeader = withContext(dreamy.thead, "header");
export const TableBody = withContext(dreamy.tbody, "body");
export const TableRow = withContext(dreamy.tr, "row");
export const TableCell = withContext(dreamy.td, "cell");
export const TableColumnHeader = withContext(dreamy.th, "columnHeader");
export const TableCaption = withContext(dreamy.caption, "caption");
