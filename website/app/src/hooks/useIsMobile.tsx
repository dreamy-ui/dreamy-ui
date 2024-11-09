import { useLayoutEffect, useState } from "react";

export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    }, []);

    return isMobile;
}
