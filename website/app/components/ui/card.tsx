"use client";

import { createStyleContext } from "styled-system/jsx";
import { card } from "styled-system/recipes";
import { dreamy } from "./factory";

const { withProvider, withContext } = createStyleContext(card);

/**
 * Card component
 *
 * @See Docs https://dreamy-ui.com/docs/components/card
 */
const CardRoot = withProvider(dreamy.div, "root");
const CardHeader = withContext(dreamy.div, "header");
const CardBody = withContext(dreamy.div, "body");
const CardFooter = withContext(dreamy.div, "footer");
const CardTitle = withContext(dreamy.h3, "title");
const CardDescription = withContext(dreamy.p, "description");

export namespace Card {
    export const Root = CardRoot;
    export const Header = CardHeader;
    export const Body = CardBody;
    export const Footer = CardFooter;
    export const Title = CardTitle;
    export const Description = CardDescription;
}
