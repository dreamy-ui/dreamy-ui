import { createStyleContext } from "@/components/style-context";
import { card } from "styled-system/recipes";
import { CardBodyBase } from "./card-body";
import { CardDescriptionBase } from "./card-description";
import { CardFooterBase } from "./card-footer";
import { CardHeaderBase } from "./card-header";
import { CardRoot } from "./card-root";
import { CardTitleBase } from "./card-title";

const { withProvider, withContext } = createStyleContext(card);

/**
 * Card component
 *
 * @See Docs https://dreamy-ui.com/docs/components/card
 */
export const Card = withProvider(CardRoot, "root");
export const CardHeader = withContext(CardHeaderBase, "header");
export const CardBody = withContext(CardBodyBase, "body");
export const CardFooter = withContext(CardFooterBase, "footer");
export const CardTitle = withContext(CardTitleBase, "title");
export const CardDescription = withContext(CardDescriptionBase, "description");
