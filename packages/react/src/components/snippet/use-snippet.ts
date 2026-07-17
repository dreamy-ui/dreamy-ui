import { useClipboard } from "@/hooks";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider/create-context";
import type { PropGetter } from "@/utils";
import { callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import {
	type ComponentPropsWithoutRef,
	type ReactNode,
	isValidElement,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

export interface SnippetContextValue {
	bodyContent: ReactNode;
	setBodyContent: (content: ReactNode) => void;
	codeString: string | undefined;
	setCodeString: (value: string | undefined) => void;
	copy: (value?: string) => void;
	copied: boolean;
	resetCopied: () => void;
	onCopy?: (value: string) => void;
	disableCopy: boolean;
}

export const [SnippetProvider, useSnippetContext] = createContext<SnippetContextValue>({
	name: "SnippetContext",
	hookName: "useSnippetContext",
	providerName: "Snippet.Root"
});

export interface UseSnippetRootProps {
	/**
	 * The time in milliseconds to wait before resetting the copied state.
	 * @default 5000
	 */
	timeout?: number;
	/**
	 * Whether to disable the copy functionality.
	 * @default false
	 */
	disableCopy?: boolean;
	/**
	 * Callback when the text is copied.
	 */
	onCopy?: (value: string) => void;
}

export function useSnippetRoot(props: UseSnippetRootProps) {
	const { timeout, disableCopy = false, onCopy } = props;

	const [bodyContent, setBodyContent] = useState<ReactNode>(null);
	const [codeString, setCodeString] = useState<string | undefined>();

	const { copy, copied, reset } = useClipboard({ timeout });

	const getCopyValue = useCallback(() => {
		if (codeString) {
			return codeString;
		}

		return getNodeText(bodyContent);
	}, [bodyContent, codeString]);

	const handleCopy = useCallback(
		(valueToCopy?: string) => {
			if (disableCopy) {
				return;
			}

			const nextValue = valueToCopy ?? getCopyValue();
			copy(nextValue);
			onCopy?.(nextValue);
		},
		[copy, disableCopy, getCopyValue, onCopy]
	);

	const resetCopied = useCallback(() => {
		reset();
	}, [reset]);

	const getRootProps = useCallback<PropGetter>((props = {}) => props, []);

	const context = useMemo<SnippetContextValue>(
		() => ({
			bodyContent,
			setBodyContent,
			codeString,
			setCodeString,
			copy: handleCopy,
			copied,
			resetCopied,
			onCopy,
			disableCopy
		}),
		[bodyContent, codeString, handleCopy, copied, resetCopied, onCopy, disableCopy]
	);

	return {
		context,
		getRootProps
	};
}

export function useSnippetHeader() {
	const { copy, copied, disableCopy } = useSnippetContext();

	const getHeaderProps = useCallback<PropGetter>(
		(props = {}) => ({
			...props,
			"aria-label": props["aria-label"] ?? "Snippet"
		}),
		[]
	);

	const getCopyButtonProps = useCallback<PropGetter>(
		(props = {}) => ({
			...props,
			"aria-label": props["aria-label"] ?? "Copy",
			"data-copied": dataAttr(copied),
			"data-part": "copy",
			onClick: callAllHandlers(props.onClick, () => copy())
		}),
		[copied, copy]
	);

	return {
		copied,
		disableCopy,
		getHeaderProps,
		getCopyButtonProps
	};
}

export interface UseSnippetBodyProps {
	/**
	 * The code string to copy. If provided, it will be copied instead of the rendered children.
	 */
	codeString?: string;
	/**
	 * Fallback content to display and copy when `codeString` is not provided.
	 */
	children?: ReactNode;
}

export function useSnippetBody(props: UseSnippetBodyProps) {
	const { codeString, children } = props;
	const preRef = useRef<HTMLPreElement>(null);

	const { setBodyContent, setCodeString } = useSnippetContext();

	useEffect(() => {
		setBodyContent(children ?? null);
	}, [children, setBodyContent]);

	useEffect(() => {
		setCodeString(codeString);
		return () => setCodeString(undefined);
	}, [codeString, setCodeString]);

	const getBodyProps = useCallback<PropGetter>((props = {}) => props, []);

	const getPreProps = useCallback<PropGetter>(
		(props = {}) => ({
			...props,
			"data-part": "pre",
			ref: mergeRefs(props.ref, preRef),
			tabIndex: props.tabIndex ?? 0
		}),
		[]
	);

	return {
		children,
		getBodyProps,
		getPreProps
	};
}

function getNodeText(node: ReactNode): string {
	if (node == null || typeof node === "boolean") {
		return "";
	}

	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map(getNodeText).join("");
	}

	if (isValidElement<{ children?: ReactNode }>(node)) {
		return getNodeText(node.props.children);
	}

	return "";
}

export type UseSnippetRootReturn = ReturnType<typeof useSnippetRoot>;
export type UseSnippetHeaderReturn = ReturnType<typeof useSnippetHeader>;
export type UseSnippetBodyReturn = ReturnType<typeof useSnippetBody>;
