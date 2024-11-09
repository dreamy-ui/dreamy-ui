import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { table } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dream } from "../factory";
import { createStyleContext } from "../style-context";

const { withContext, withProvider } = createStyleContext(table);

const StyledTable = styled(dream.table);
const StyledWrapper = styled(dream.div);

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
export const TableHeader = withContext(styled(dream.thead), "header");
export const TableBody = withContext(styled(dream.tbody), "body");
export const TableRow = withContext(styled(dream.tr), "row");
export const TableCell = withContext(styled(dream.td), "cell");
export const TableColumnHeader = withContext(styled(dream.th), "columnHeader");
export const TableCaption = withContext(styled(dream.caption), "caption");
