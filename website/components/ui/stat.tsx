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
const StatRoot = withProvider<DreamyComponent<"dl", StatRootProps>>(dreamy.dl, "root");

export interface StatLabelProps extends HTMLDreamyProps<"dt"> {}
const StatLabel = withContext<DreamyComponent<"dt", StatLabelProps>>(dreamy.dt, "label");

export interface StatValueTextProps extends HTMLDreamyProps<"dd"> {}
const StatValueText = withContext<DreamyComponent<"dd", StatValueTextProps>>(
    dreamy.dd,
    "valueText"
);

export interface StatHintProps extends HTMLDreamyProps<"span"> {}
const StatHint = withContext<DreamyComponent<"span", StatHintProps>>(dreamy.span, "hint");

export interface StatValueUnitProps extends HTMLDreamyProps<"span"> {}
const StatValueUnit = withContext<DreamyComponent<"span", StatValueUnitProps>>(
    dreamy.span,
    "valueUnit"
);

export interface StatUpIndicatorProps extends HTMLDreamyProps<"span"> {}
const StatUpIndicator = withContext<DreamyComponent<"span", StatUpIndicatorProps>>(
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
const StatDownIndicator = withContext<DreamyComponent<"span", StatDownIndicatorProps>>(
    dreamy.span,
    "indicator",
    {
        defaultProps: {
            "data-type": "down",
            children: <ArrowDownIcon />
        }
    }
);

export namespace Stat {
    export const Root = StatRoot;
    export const Label = StatLabel;
    export const ValueText = StatValueText;
    export const Hint = StatHint;
    export const ValueUnit = StatValueUnit;
    export const UpIndicator = StatUpIndicator;
    export const DownIndicator = StatDownIndicator;
}
