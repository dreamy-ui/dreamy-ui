"use client";

import {
    type DreamyComponent,
    type HTMLDreamyProps,
    createStyleContext,
    dreamy
} from "styled-system/jsx";
import { type EmptyStateVariantProps, emptyState } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(emptyState);

export interface EmptyStateRootProps extends HTMLDreamyProps<"div">, EmptyStateVariantProps {}
export const Root = withProvider<DreamyComponent<"div", EmptyStateRootProps>>(
    dreamy.div,
    "root"
);

export interface EmptyStateContentProps extends HTMLDreamyProps<"div"> {}
export const Content = withContext<DreamyComponent<"div", EmptyStateContentProps>>(
    dreamy.div,
    "content"
);

export interface EmptyStateIndicatorProps extends HTMLDreamyProps<"div"> {}
export const Indicator = withContext<DreamyComponent<"div", EmptyStateIndicatorProps>>(
    dreamy.div,
    "indicator"
);

export interface EmptyStateTitleProps extends HTMLDreamyProps<"h3"> {}
export const Title = withContext<DreamyComponent<"h3", EmptyStateTitleProps>>(
    dreamy.h3,
    "title"
);

export interface EmptyStateDescriptionProps extends HTMLDreamyProps<"p"> {}
export const Description = withContext<DreamyComponent<"p", EmptyStateDescriptionProps>>(
    dreamy.p,
    "description"
);
