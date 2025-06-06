import { createStyleContext } from "@/components/style-context";
import { menu } from "styled-system/recipes";
import { MenuButtonBase } from "./menu-button";
import { MenuContentBase } from "./menu-content";
import { MenuRoot } from "./menu-root";
import { MenuTriggerBase } from "./menu-trigger";

const { withProvider, withContext } = createStyleContext(menu);

/**
 * Menu component
 *
 * @See Docs https://dreamy-ui.com/docs/components/menu
 */
export const Menu = withProvider(MenuRoot, "root");
export const MenuContent = withContext(MenuContentBase, "content");
export const MenuItem = withContext(MenuButtonBase, "item");
export { MenuTriggerBase as MenuTrigger };
