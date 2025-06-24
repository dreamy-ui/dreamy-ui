import { card } from "styled-system/recipes";
import { dreamy } from "./factory";
import { createStyleContext } from "./style-context";

const { withProvider, withContext } = createStyleContext(card);

/**
 * Card component
 *
 * @See Docs https://dreamy-ui.com/docs/components/card
 */
export const Card = withProvider(dreamy.div, "root");
export const CardHeader = withContext(dreamy.div, "header");
export const CardBody = withContext(dreamy.div, "body");
export const CardFooter = withContext(dreamy.div, "footer");
export const CardTitle = withContext(dreamy.h3, "title");
export const CardDescription = withContext(dreamy.p, "description");
