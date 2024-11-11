import { useSafeLayoutEffect } from "@dreamy-ui/react";
import { useState } from "react";

export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useSafeLayoutEffect(() => {
        setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    }, []);

    return isMobile;
}
