"use client";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type EmptyStateVariantProps, emptyState } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(emptyState);

export interface EmptyStateRootProps extends HTMLDreamyProps<"div">, EmptyStateVariantProps {}

/**
 * Empty State component — placeholder when there is no content to show.
 *
 * @see Docs https://dreamy-ui.com/docs/components/empty-state
 *
 * @example
 * ```tsx
 * <EmptyState.Root>
 *   <EmptyState.Indicator>📭</EmptyState.Indicator>
 *   <EmptyState.Content>
 *     <EmptyState.Title>No results</EmptyState.Title>
 *     <EmptyState.Description>Try a different search.</EmptyState.Description>
 *   </EmptyState.Content>
 * </EmptyState.Root>
 * ```
 */
export const Root = withProvider(dreamy.div, "root");

export interface EmptyStateContentProps extends HTMLDreamyProps<"div"> {}

/**
 * Empty State Content — text and actions container.
 */
export const Content = withContext(dreamy.div, "content");

export interface EmptyStateIndicatorProps extends HTMLDreamyProps<"div"> {}

/**
 * Empty State Indicator — icon or illustration area.
 */
export const Indicator = withContext(dreamy.div, "indicator");

export interface EmptyStateTitleProps extends HTMLDreamyProps<"h3"> {}

/**
 * Empty State Title — primary empty-state heading.
 */
export const Title = withContext(dreamy.h3, "title");

export interface EmptyStateDescriptionProps extends HTMLDreamyProps<"p"> {}

/**
 * Empty State Description — supporting empty-state text.
 */
export const Description = withContext(dreamy.p, "description");
