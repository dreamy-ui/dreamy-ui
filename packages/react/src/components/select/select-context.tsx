import { createContext } from "@/provider/create-context";
import type { UseSelectReturn } from "./use-select";

interface SelectContext extends Omit<UseSelectReturn, "rest"> {}

export const [SelectProvider, useSelectContext] = createContext<SelectContext>({
    name: "SelectContext",
    hookName: "useSelectContext",
    providerName: "Select"
});
