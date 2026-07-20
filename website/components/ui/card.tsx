"use client";

import { createStyleContext, dreamy } from "styled-system/jsx";
import { card } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(card);

/**
 * Card component — bordered container for related content.
 *
 * @see Docs https://dreamy-ui.com/docs/components/card
 *
 * @example
 * ```tsx
 * <Card.Root>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description</Card.Description>
 *   </Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card.Root>
 * ```
 */
export const Root = withProvider(dreamy.div, "root");

/**
 * Card Header — top section of the card.
 */
export const Header = withContext(dreamy.div, "header");

/**
 * Card Body — main content area of the card.
 */
export const Body = withContext(dreamy.div, "body");

/**
 * Card Footer — bottom section for actions or meta.
 */
export const Footer = withContext(dreamy.div, "footer");

/**
 * Card Title — primary heading inside the card.
 */
export const Title = withContext(dreamy.h3, "title");

/**
 * Card Description — supporting text under the title.
 */
export const Description = withContext(dreamy.p, "description");
