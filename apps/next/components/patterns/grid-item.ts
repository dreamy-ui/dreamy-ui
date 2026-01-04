import { definePattern } from "@pandacss/dev";

export const gridItem = definePattern({
    properties: {
        colSpan: { type: "number" },
        rowSpan: { type: "number" },
        colStart: { type: "number" },
        rowStart: { type: "number" },
        colEnd: { type: "number" },
        rowEnd: { type: "number" }
    },
    transform(props, { map }) {
        const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, ...rest } = props;
        const spanFn = (v: string) => (v === "auto" ? v : `span ${v}`);
        return {
            gridColumn: colSpan != null ? map(colSpan, spanFn) : undefined,
            gridRow: rowSpan != null ? map(rowSpan, spanFn) : undefined,
            gridColumnStart: colStart,
            gridColumnEnd: colEnd,
            gridRowStart: rowStart,
            gridRowEnd: rowEnd,
            ...rest
        };
    }
});
