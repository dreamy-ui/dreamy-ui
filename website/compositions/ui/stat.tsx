"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@dreamy-ui/react";
import {
    type DreamyComponent,
    type HTMLDreamyProps,
    createStyleContext,
    dreamy
} from "styled-system/jsx";
import { type StatVariantProps, stat } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stat);

export interface StatRootProps extends HTMLDreamyProps<"dl">, StatVariantProps {}
export const Root = withProvider<DreamyComponent<"dl", StatRootProps>>(dreamy.dl, "root");

export interface StatLabelProps extends HTMLDreamyProps<"dt"> {}
export const Label = withContext<DreamyComponent<"dt", StatLabelProps>>(dreamy.dt, "label");

export interface StatValueTextProps extends HTMLDreamyProps<"dd"> {}
export const ValueText = withContext<DreamyComponent<"dd", StatValueTextProps>>(
    dreamy.dd,
    "valueText"
);

export interface StatHintProps extends HTMLDreamyProps<"span"> {}
export const Hint = withContext<DreamyComponent<"span", StatHintProps>>(dreamy.span, "hint");

export interface StatValueUnitProps extends HTMLDreamyProps<"span"> {}
export const ValueUnit = withContext<DreamyComponent<"span", StatValueUnitProps>>(
    dreamy.span,
    "valueUnit"
);

export interface StatUpIndicatorProps extends HTMLDreamyProps<"span"> {}
export const UpIndicator = withContext<DreamyComponent<"span", StatUpIndicatorProps>>(
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
export const DownIndicator = withContext<DreamyComponent<"span", StatDownIndicatorProps>>(
    dreamy.span,
    "indicator",
    {
        defaultProps: {
            "data-type": "down",
            children: <ArrowDownIcon />
        }
    }
);
