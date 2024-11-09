import type { UsePopoverReturn } from "@/components/popover/use-popover";
import { createContext } from "@/provider/create-context";

interface PopoverContext extends UsePopoverReturn {
    hasArrow?: boolean;
}

export const [PopoverProvider, usePopoverContext] = createContext<PopoverContext>({
    name: "PopoverContext",
    errorMessage:
        "usePopoverContext: `context` is undefined. Seems you forgot to wrap all popover components within `<Popover />`"
});
