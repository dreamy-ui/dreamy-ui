import { useSafeLayoutEffect } from "@dreamy-ui/react";
import { useMemo, useState } from "react";

export default function useScroll() {
    const [scrollY, setScrollY] = useState(0);

    useSafeLayoutEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollYProgress = useMemo(() => {
        if (typeof document === "undefined") return 0;

        return scrollY / document.body.scrollHeight;
    }, [scrollY]);

    return { scrollY, scrollYProgress };
}
