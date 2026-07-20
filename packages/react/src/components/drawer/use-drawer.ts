import { createContext } from "@/provider";
import {
    type ModalOptions,
    RemoveScroll,
    type UseModalProps,
    type UseModalReturn,
    useModal,
    useModalManager
} from "../modal/use-modal";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerOptions extends ModalOptions {}

export interface UseDrawerProps extends UseModalProps {
    /**
     * The placement of the drawer relative to the viewport.
     * @default "right"
     */
    placement?: DrawerPlacement;
}

export interface UseDrawerReturn extends UseModalReturn {
    placement: DrawerPlacement;
}

interface DrawerContext extends DrawerOptions, UseDrawerReturn {
    scrollBehavior?: "inside" | "outside";
}

export const [DrawerContextProvider, useDrawerContext] = createContext<DrawerContext>({
    strict: true,
    name: "DrawerContext",
    errorMessage:
        "useDrawerContext: `context` is undefined. Seems you forgot to wrap drawer components in `<Drawer.Root />`"
});

/**
 * Drawer hook that manages dialog state, focus, and placement for the drawer widget.
 * Builds on the shared modal dialog logic so drawers stack with modals correctly.
 */
export function useDrawer(props: UseDrawerProps): UseDrawerReturn {
    const { placement = "right", ...rest } = props;
    const modal = useModal(rest);

    return {
        ...modal,
        placement
    };
}

export { RemoveScroll, useModalManager as useDrawerManager };
