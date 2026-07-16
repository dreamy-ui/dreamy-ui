"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@dreamy-ui/react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type StatVariantProps, stat } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stat);

export interface StatRootProps extends HTMLDreamyProps<"dl">, StatVariantProps {}
export const Root = withProvider(dreamy.dl, "root");

export interface StatLabelProps extends HTMLDreamyProps<"dt"> {}
export const Label = withContext(dreamy.dt, "label");

export interface StatValueTextProps extends HTMLDreamyProps<"dd"> {}
export const ValueText = withContext(dreamy.dd, "valueText");

export interface StatHintProps extends HTMLDreamyProps<"span"> {}
export const Hint = withContext(dreamy.span, "hint");

export interface StatValueUnitProps extends HTMLDreamyProps<"span"> {}
export const ValueUnit = withContext(dreamy.span, "valueUnit");

export interface StatUpIndicatorProps extends HTMLDreamyProps<"span"> {}
export const UpIndicator = withContext(dreamy.span, "indicator", {
    defaultProps: {
        "data-type": "up",
        "aria-label": "increased",
        children: <ArrowUpIcon aria-hidden="true" />
    }
});

export interface StatDownIndicatorProps extends HTMLDreamyProps<"span"> {}
export const DownIndicator = withContext(dreamy.span, "indicator", {
    defaultProps: {
        "data-type": "down",
        "aria-label": "decreased",
        children: <ArrowDownIcon aria-hidden="true" />
    }
});
