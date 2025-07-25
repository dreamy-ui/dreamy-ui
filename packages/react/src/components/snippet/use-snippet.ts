import { useClipboard } from "@/hooks";
import type { PropGetter } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { objectToDeps } from "@/utils/object";
import { useFocusRing } from "@react-aria/focus";
import { type ForwardedRef, type ReactElement, useCallback, useMemo, useRef } from "react";
import type { ButtonProps, IconButtonProps } from "../button";
import type { TooltipProps } from "../tooltip";

export interface UseSnippetProps {
    /**
     * Ref to the DOM node.
     */
    ref?: ForwardedRef<HTMLDivElement | null>;
    /**
     * The content of the snippet.
     * if `string[]` is passed, it will be rendered as a multi-line snippet.
     */
    children?: React.ReactNode | string | string[];
    /**
     * The symbol to show before the snippet.
     * @default "$"
     */
    symbol?: string | React.ReactNode;
    /**
     * The time in milliseconds to wait before resetting the clipboard.
     * @default 5000
     */
    timeout?: number;
    /*
     * Snippet copy icon.
     */
    copyIcon?: ReactElement;
    /*
     * Snippet copy icon. This icon will be shown when the text is copied.
     */
    checkIcon?: ReactElement;
    /**
     * Whether the copy button should receive focus on render.
     * @default false
     */
    autoFocus?: boolean;
    /**
     * The code string to copy. if `codeString` is passed, it will be copied instead of the children.
     */
    codeString?: string;
    /**
     * Whether to hide the tooltip.
     * @default false
     */
    disableTooltip?: boolean;
    /**
     * Whether to disable the copy functionality.
     * @default false
     */
    disableCopy?: boolean;
    /**
     * Whether to hide the copy button.
     * @default false
     */
    hideCopyButton?: boolean;
    /**
     * Whether to hide the symbol.
     * @default false
     */
    hideSymbol?: boolean;
    /**
     * Tooltip props.
     */
    tooltipProps?: Partial<TooltipProps>;
    /**
     * Copy button props.
     */
    copyButtonProps?: Partial<ButtonProps>;
    /**
     * Callback when the text is copied.
     */
    onCopy?: (value: string | string[]) => void;
    reduceMotion?: boolean;
    className?: string;
}

export function useSnippet(props: UseSnippetProps) {
    const {
        ref,
        children,
        symbol = "$",
        timeout,
        copyIcon,
        checkIcon,
        codeString,
        disableCopy = false,
        disableTooltip = false,
        hideCopyButton = false,
        autoFocus = false,
        hideSymbol = false,
        onCopy: onCopyProp,
        tooltipProps: userTooltipProps = {},
        copyButtonProps = {},
        className,
        ...otherProps
    } = props;

    const tooltipProps: Partial<TooltipProps> = {
        content: "Copy to clipboard",
        openDelay: 1000,
        ...userTooltipProps
    };

    const preRef = useRef<HTMLPreElement>(null);

    const { copy, copied } = useClipboard({ timeout });

    const isMultiLine = children && Array.isArray(children);

    const { isFocusVisible } = useFocusRing({
        autoFocus
    });

    const symbolBefore = useMemo(() => {
        if (!symbol || typeof symbol !== "string") return symbol;
        const str = symbol.trim();

        return str ? `${str} ` : "";
    }, [symbol]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const getSnippetProps = useCallback<PropGetter>(
        () => ({
            ...otherProps,
            ref
        }),
        [objectToDeps(otherProps), ref]
    );

    const onCopy = useCallback(() => {
        if (disableCopy) {
            return;
        }

        let stringValue = "";

        if (typeof children === "string") {
            stringValue = children;
        } else if (Array.isArray(children)) {
            children.forEach((child: any) => {
                // @ts-ignore
                const childString =
                    typeof child === "string" ? child : child?.props?.children?.toString();

                if (childString) {
                    stringValue += childString + "\n";
                }
            });
        }

        const valueToCopy =
            codeString ||
            stringValue ||
            preRef.current?.textContent?.replace(symbolBefore?.toString() ?? "", "") ||
            "";

        copy(valueToCopy);
        onCopyProp?.(valueToCopy);
    }, [copy, codeString, disableCopy, onCopyProp, children]);

    const getCopyButtonProps: PropGetter<IconButtonProps, { "aria-label": string }> = useCallback(
        () => ({
            ...copyButtonProps,
            "aria-label":
                typeof tooltipProps.content === "string" && tooltipProps.content
                    ? (tooltipProps.content as string)
                    : "Copy to clipboard",
            "data-copied": dataAttr(copied),
            "data-part": "copy",
            onClick: onCopy
        }),
        [
            copied,
            onCopy,
            // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
            tooltipProps,
            copyButtonProps
        ]
    );

    return {
        preRef,
        children,
        copied,
        onCopy,
        copyIcon,
        checkIcon,
        symbolBefore,
        isMultiLine,
        isFocusVisible,
        hideCopyButton,
        disableCopy,
        disableTooltip,
        hideSymbol,
        tooltipProps,
        getSnippetProps,
        getCopyButtonProps
    };
}

export type UseSnippetReturn = ReturnType<typeof useSnippet>;
