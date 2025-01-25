import { PopoverBodyBase } from "@/components/popover/popover-body";
import { PopoverCloseButtonBase } from "@/components/popover/popover-close-button";
import { PopoverContentBase } from "@/components/popover/popover-content";
import { PopoverFooterBase } from "@/components/popover/popover-footer";
import { PopoverHeaderBase } from "@/components/popover/popover-header";
import { PopoverRoot } from "@/components/popover/popover-root";
import { createStyleContext } from "@/components/style-context";
import { popover } from "@dreamy-ui/system/recipes";
import { PopoverAnchor } from "./popover-anchor";
import { PopoverArrow } from "./popover-arrow";
import { PopoverTrigger } from "./popover-trigger";

const { withProvider, withContext } = createStyleContext(popover);

/**
 * Popover component
 *
 * @See Docs https://dreamy-ui.com/docs/components/popover
 */
export const Popover = withProvider(PopoverRoot);
export const PopoverContent = withContext(PopoverContentBase, "content");
export const PopoverHeader = withContext(PopoverHeaderBase, "header");
export const PopoverBody = withContext(PopoverBodyBase, "body");
export const PopoverFooter = withContext(PopoverFooterBase, "footer");
export const PopoverCloseButton = withContext(PopoverCloseButtonBase, "close");

export { PopoverAnchor, PopoverArrow, PopoverTrigger };
