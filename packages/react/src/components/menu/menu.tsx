"use client";

import { createStyleContext } from "@/components/style-context";
import { menu } from "@dreamy-ui/system/recipes";
import { MenuButtonBase } from "./menu-button";
import { MenuContentBase } from "./menu-content";
import { MenuRoot } from "./menu-root";
import { MenuTriggerBase } from "./menu-trigger";

const { withProvider, withContext } = createStyleContext(menu);

/**
 * Menu component
 *
 * @See Docs https://dreamy-ui.com/docs/components/Menu
 */
export const Menu = withProvider(MenuRoot, "root");
export const MenuContent = withContext(MenuContentBase, "content");
export const MenuItem = withContext(MenuButtonBase, "item");
export { MenuTriggerBase as MenuTrigger };
