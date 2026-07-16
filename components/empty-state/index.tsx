"use client";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type EmptyStateVariantProps, emptyState } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(emptyState);

export interface EmptyStateRootProps extends HTMLDreamyProps<"div">, EmptyStateVariantProps {}
export const Root = withProvider(dreamy.div, "root");

export interface EmptyStateContentProps extends HTMLDreamyProps<"div"> {}
export const Content = withContext(dreamy.div, "content");

export interface EmptyStateIndicatorProps extends HTMLDreamyProps<"div"> {}
export const Indicator = withContext(dreamy.div, "indicator");

export interface EmptyStateTitleProps extends HTMLDreamyProps<"h3"> {}
export const Title = withContext(dreamy.h3, "title");

export interface EmptyStateDescriptionProps extends HTMLDreamyProps<"p"> {}
export const Description = withContext(dreamy.p, "description");
