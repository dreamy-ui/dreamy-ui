"use client";

import { createStyleContext, dreamy } from "styled-system/jsx";
import { card } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(card);

/**
 * Card component
 *
 * @See Docs https://dreamy-ui.com/docs/components/card
 */
export const Root = withProvider(dreamy.div, "root");
export const Header = withContext(dreamy.div, "header");
export const Body = withContext(dreamy.div, "body");
export const Footer = withContext(dreamy.div, "footer");
export const Title = withContext(dreamy.h3, "title");
export const Description = withContext(dreamy.p, "description");


