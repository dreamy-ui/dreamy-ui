"use client";

import { SelectContentBase } from "@/components/select/select-content";
import { SelectClearButtonBase, SelectIndicatorBase } from "@/components/select/select-indicator";
import { SelectItemBase } from "@/components/select/select-item";
import { SelectItemIndicatorBase } from "@/components/select/select-item-indicator";
import { SelectTriggerBase } from "@/components/select/select-trigger";
import { createStyleContext } from "@/components/style-context";
import { Box } from "@/rsc";
import type React from "react";
import { select } from "styled-system/recipes";
import type { SelectProps } from "./select-root";
import { SelectRoot } from "./select-root";

const { withProvider, withContext } = createStyleContext(select);

/**
 * Select component
 *
 * @See Docs https://dreamy-ui.com/docs/components/select
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
export const SelectClearButton = withContext(SelectClearButtonBase, "clearButton");
export const SelectItemIndicator = withContext(SelectItemIndicatorBase, "itemIndicator");
