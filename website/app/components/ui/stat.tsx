"use client";

import { createStyleContext } from "styled-system/jsx";
import { type StatVariantProps, stat } from "styled-system/recipes";
import { type DreamyComponent, type HTMLDreamyProps, dreamy } from "./factory";

const { withProvider, withContext } = createStyleContext(stat);

export interface StatRootProps extends HTMLDreamyProps<"dl">, StatVariantProps {}
export const StatRoot = withProvider<DreamyComponent<"dl", StatRootProps>>(dreamy.dl, "root");

export interface StatLabelProps extends HTMLDreamyProps<"dt"> {}
export const StatLabel = withContext<DreamyComponent<"dt", StatLabelProps>>(dreamy.dt, "label");

export interface StatValueTextProps extends HTMLDreamyProps<"dd"> {}
export const StatValueText = withContext<DreamyComponent<"dd", StatValueTextProps>>(
    dreamy.dd,
    "valueText"
);

export interface StatHelpTextProps extends HTMLDreamyProps<"span"> {}
export const StatHelpText = withContext<DreamyComponent<"span", StatHelpTextProps>>(
    dreamy.span,
    "helpText"
);

export interface StatValueUnitProps extends HTMLDreamyProps<"span"> {}
export const StatValueUnit = withContext<DreamyComponent<"span", StatValueUnitProps>>(
    dreamy.span,
    "valueUnit"
);

export interface StatUpIndicatorProps extends HTMLDreamyProps<"span"> {}
export const StatUpIndicator = withContext<DreamyComponent<"span", StatUpIndicatorProps>>(
    dreamy.span,
    "indicator",
    {
        defaultProps: {
            "data-type": "up",
            children: <ArrowUpIcon />
        }
    }
);

export interface StatDownIndicatorProps extends HTMLDreamyProps<"span"> {}
export const StatDownIndicator = withContext<DreamyComponent<"span", StatDownIndicatorProps>>(
    dreamy.span,
    "indicator",
    {
        defaultProps: {
            "data-type": "down",
            children: <ArrowDownIcon />
        }
    }
);
