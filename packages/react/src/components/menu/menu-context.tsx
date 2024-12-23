import { createContext } from "@/provider/create-context";
import type { UseMenuReturn } from "./use-menu";

interface MenuContext extends Omit<UseMenuReturn, "rest"> {}

export const [MenuProvider, useMenuContext] = createContext<MenuContext>({
    name: "MenuContext",
    hookName: "useMenuContext",
    providerName: "Menu"
});
