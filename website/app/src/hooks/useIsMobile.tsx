import { useSafeLayoutEffect } from "@dreamy-ui/react";
import { useState } from "react";

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useSafeLayoutEffect(() => {
		setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);

		function listener() {
			setIsMobile(window.innerWidth < 768);
		}

		window.addEventListener("resize", listener);

		return () => window.removeEventListener("resize", listener);
	}, []);

	return isMobile;
}
