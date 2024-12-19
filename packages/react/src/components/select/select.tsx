"use client";

import { SelectContentBase } from "@/components/select/select-content";
import { SelectIndicatorBase } from "@/components/select/select-indicator";
import { SelectItemBase } from "@/components/select/select-item";
import { SelectItemIndicatorBase } from "@/components/select/select-item-indicator";
import { SelectTriggerBase } from "@/components/select/select-trigger";
import { createStyleContext } from "@/components/style-context";
import { Box } from "@/rsc";
import { type SelectVariantProps, select } from "@dreamy-ui/system/recipes";
import type React from "react";
import type { PropsWithChildren } from "react";
import { SelectRoot } from "./select-root";
import type { UseSelectProps } from "./use-select";

const { withProvider, withContext } = createStyleContext(select);

type SelectProps<T extends boolean> = UseSelectProps<T> & SelectVariantProps & PropsWithChildren;

/**
 * Select component
 *
 * @See Docs https://dream-ui.com/docs/components/select
 */
export const Select: <T extends boolean = false>(props: SelectProps<T>) => React.JSX.Element =
    withProvider(SelectRoot, "root") as any;
export const SelectTrigger = withContext(SelectTriggerBase, "trigger");
export const SelectContent = withContext(SelectContentBase, "content");
export const SelectItem = withContext(SelectItemBase, "item");

/**
 * @internal
 */
export const SelectIndicatorGroup = withContext(Box, "indicatorGroup");
export const SelectIndicator = withContext(SelectIndicatorBase, "indicator");
export const SelectItemIndicator = withContext(SelectItemIndicatorBase, "itemIndicator");
