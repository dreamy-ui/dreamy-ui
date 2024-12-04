"use client";

import { SelectContentBase } from "@/components/select/select-content";
import { SelectIndicatorBase } from "@/components/select/select-indicator";
import { SelectItemBase } from "@/components/select/select-item";
import { SelectItemIndicatorBase } from "@/components/select/select-item-indicator";
import { SelectTriggerBase } from "@/components/select/select-trigger";
import { createStyleContext } from "@/components/style-context";
import { Box } from "@/rsc";
import { select } from "@dreamy-ui/system/recipes";
import { SelectRoot } from "./select-root";

const { withProvider, withContext } = createStyleContext(select);

/**
 * Select component
 *
 * @See Docs https://dream-ui.com/docs/components/select
 */
export const Select = withProvider(SelectRoot, "root");
export const SelectTrigger = withContext(SelectTriggerBase, "trigger");
export const SelectContent = withContext(SelectContentBase, "content");
export const SelectItem = withContext(SelectItemBase, "item");

/**
 * @internal
 */
export const SelectIndicatorGroup = withContext(Box, "indicatorGroup");
export const SelectIndicator = withContext(SelectIndicatorBase, "indicator");
export const SelectItemIndicator = withContext(SelectItemIndicatorBase, "itemIndicator");
