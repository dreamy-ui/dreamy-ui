import { useSafeLayoutEffect } from "@/hooks";
import { useCallback, useRef, useState } from "react";

export function randomColor(string: string) {
	return randomColorFromString(string);
}

function randomColorFromString(str: string) {
	let hash = 0;
	if (str.length === 0) return hash.toString();
	for (let i = 0; i < str.length; i += 1) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}
	let color = "#";
	for (let j = 0; j < 3; j += 1) {
		const value = (hash >> (j * 8)) & 255;
		color += `00${value.toString(16)}`.slice(-2);
	}
	return color;
}

export function initials(name: string) {
	const names = name.trim().split(" ");
	const firstName = names[0] ?? "";
	const lastName = names.length > 1 ? names[names.length - 1] : "";
	return firstName && lastName
		? `${firstName.charAt(0)}${lastName.charAt(0)}`
		: firstName.charAt(0);
}

// Custom useImage hook for avatar
export function useAvatarImage(props: {
	src?: string;
	srcSet?: string;
	sizes?: string;
	onLoad?: React.ImgHTMLAttributes<HTMLImageElement>["onLoad"];
	onError?: React.ImgHTMLAttributes<HTMLImageElement>["onError"];
	crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
	loading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"];
}) {
	const { loading, src, srcSet, onLoad, onError, crossOrigin, sizes } = props;

	type Status = "loading" | "failed" | "pending" | "loaded";
	const [status, setStatus] = useState<Status>("pending");

	useSafeLayoutEffect(() => {
		setStatus(src ? "loading" : "pending");
	}, [src]);

	const imageRef = useRef<HTMLImageElement | null>(null);

	const load = useCallback(() => {
		if (!src) return;

		flush();

		const img = new window.Image();
		img.src = src;
		if (crossOrigin) img.crossOrigin = crossOrigin;
		if (srcSet) img.srcset = srcSet;
		if (sizes) img.sizes = sizes;
		if (loading) img.loading = loading;

		img.onload = (event) => {
			flush();
			setStatus("loaded");
			onLoad?.(event as any);
		};
		img.onerror = (error) => {
			flush();
			setStatus("failed");
			onError?.(error as any);
		};

		imageRef.current = img;
	}, [src, crossOrigin, srcSet, sizes, onLoad, onError, loading]);

	const flush = useCallback(() => {
		if (imageRef.current) {
			imageRef.current.onload = null;
			imageRef.current.onerror = null;
			imageRef.current = null;
		}
	}, []);

	useSafeLayoutEffect(() => {
		if (status === "loading") {
			load();
		}
		return () => {
			flush();
		};
	}, [status, load]);

	return status;
}
