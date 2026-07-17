"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@dreamy-ui/react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type StatVariantProps, stat } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stat);

export interface StatRootProps extends HTMLDreamyProps<"dl">, StatVariantProps {}

/**
 * Stat component — displays a labeled metric with optional trend indicators.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stat
 *
 * @example
 * ```tsx
 * <Stat.Root>
 *   <Stat.Label>Sales</Stat.Label>
 *   <Stat.ValueText>1,200</Stat.ValueText>
 *   <Stat.UpIndicator />
 * </Stat.Root>
 * ```
 */
export const Root = withProvider(dreamy.dl, "root");

export interface StatLabelProps extends HTMLDreamyProps<"dt"> {}

/**
 * Stat Label — name of the metric.
 */
export const Label = withContext(dreamy.dt, "label");

export interface StatValueTextProps extends HTMLDreamyProps<"dd"> {}

/**
 * Stat ValueText — primary numeric value.
 */
export const ValueText = withContext(dreamy.dd, "valueText");

export interface StatHintProps extends HTMLDreamyProps<"span"> {}

/**
 * Stat Hint — supporting helper text.
 */
export const Hint = withContext(dreamy.span, "hint");

export interface StatValueUnitProps extends HTMLDreamyProps<"span"> {}

/**
 * Stat ValueUnit — unit suffix for the value (e.g. `%`, `ms`).
 */
export const ValueUnit = withContext(dreamy.span, "valueUnit");

export interface StatUpIndicatorProps extends HTMLDreamyProps<"span"> {}

/**
 * Stat UpIndicator — positive trend arrow.
 */
export const UpIndicator = withContext(dreamy.span, "indicator", {
    defaultProps: {
        "data-type": "up",
        "aria-label": "increased",
        children: <ArrowUpIcon aria-hidden="true" />
    }
});

export interface StatDownIndicatorProps extends HTMLDreamyProps<"span"> {}

/**
 * Stat DownIndicator — negative trend arrow.
 */
export const DownIndicator = withContext(dreamy.span, "indicator", {
    defaultProps: {
        "data-type": "down",
        "aria-label": "decreased",
        children: <ArrowDownIcon aria-hidden="true" />
    }
});
