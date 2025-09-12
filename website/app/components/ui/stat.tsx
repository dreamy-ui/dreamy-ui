"use client";

import { forwardRef, useMemo } from "react";
import { createStyleContext } from "styled-system/jsx";
import { stat } from "styled-system/recipes";

////////////////////////////////////////////////////////////////////////////////////

const { withProvider, withContext } = createStyleContext(stat);

////////////////////////////////////////////////////////////////////////////////////

export interface StatRootBaseProps extends SlotRecipeProps<"stat">, UnstyledProp {}

export interface StatRootProps extends HTMLChakraProps<"dl", StatRootBaseProps> {}

export const StatRoot = withProvider<HTMLDListElement>("dl", "root");

const s = <StatRoot />;

export const StatPropsProvider = PropsProvider as React.Provider<StatRootBaseProps>;

////////////////////////////////////////////////////////////////////////////////////

export interface StatLabelProps extends HTMLChakraProps<"dt">, UnstyledProp {}

export const StatLabel = withContext<HTMLElement, StatLabelProps>("dt", "label");

////////////////////////////////////////////////////////////////////////////////////

export interface StatValueTextProps extends HTMLChakraProps<"dd">, UnstyledProp {}

export const StatValueText = withContext<HTMLElement, StatValueTextProps>("dd", "valueText");

////////////////////////////////////////////////////////////////////////////////////

export interface StatHelpTextProps extends HTMLChakraProps<"span">, UnstyledProp {}

export const StatHelpText = withContext<HTMLElement, StatHelpTextProps>("span", "helpText");

////////////////////////////////////////////////////////////////////////////////////

export interface StatValueUnitProps extends HTMLChakraProps<"span">, UnstyledProp {}

export const StatValueUnit = withContext<HTMLElement, StatValueUnitProps>("span", "valueUnit");

////////////////////////////////////////////////////////////////////////////////////

export interface StatUpIndicatorProps extends HTMLChakraProps<"span">, UnstyledProp {}

export const StatUpIndicator = withContext<HTMLElement, StatUpIndicatorProps>("span", "indicator", {
    defaultProps: {
        "data-type": "up",
        children: <ArrowUpIcon />
    }
});

////////////////////////////////////////////////////////////////////////////////////

export interface StatDownIndicatorProps extends HTMLChakraProps<"span">, UnstyledProp {}

export const StatDownIndicator = withContext<HTMLElement, StatDownIndicatorProps>(
    "span",
    "indicator",
    {
        defaultProps: {
            "data-type": "down",
            children: <ArrowDownIcon />
        }
    }
);

////////////////////////////////////////////////////////////////////////////////////

export interface StatGroupProps extends SlotRecipeProps<"stat">, HTMLChakraProps<"div"> {}

export const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(function StatGroup(props, ref) {
    const recipe = useSlotRecipe({ key: "stat" });
    const [variantProps, localProps] = useMemo(
        () => recipe.splitVariantProps(props),
        [props, recipe]
    );
    return (
        <PropsProvider value={variantProps}>
            <chakra.div
                ref={ref}
                role="group"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-around"
                alignItems="flex-start"
                {...localProps}
            />
        </PropsProvider>
    );
});
