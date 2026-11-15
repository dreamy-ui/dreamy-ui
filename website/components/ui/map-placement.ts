import type { DrawerPlacement } from "@dreamy-ui/react";

type SwipeDirection = "start" | "end" | "up" | "down";

export function placementToSwipeDirection(placement: DrawerPlacement): SwipeDirection {
    switch (placement) {
        case "left":
            return "start";
        case "right":
            return "end";
        case "top":
            return "up";
        case "bottom":
            return "down";
        default:
            return "end";
    }
}
