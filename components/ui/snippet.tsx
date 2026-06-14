"use client";

import { type UseSnippetProps, useSnippet } from "@dreamy-ui/react";
import { type SVGProps, cloneElement, forwardRef, useMemo } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SnippetVariantProps, snippet } from "styled-system/recipes";
import { IconButton, type IconButtonProps } from "./icon-button";
import { Tooltip, type TooltipProps } from "./tooltip";

export interface SnippetProps
    extends UseSnippetProps<TooltipProps, IconButtonProps>,
        Omit<HTMLDreamyProps<"div">, keyof UseSnippetProps<TooltipProps, IconButtonProps>>,
        SnippetVariantProps {}

const StyledSnippet = dreamy("div", snippet);

/**
 * Snippet component
 *
 * @See Docs https://dreamy-ui.com/docs/components/snippet
 */
export const Snippet = forwardRef<HTMLDivElement, SnippetProps>((props, ref) => {
    const {
        preRef,
        children,
        copied,
        copyIcon = <CopyIcon />,
        checkIcon = <CheckIcon />,
        symbolBefore,
        disableTooltip,
        hideSymbol,
        hideCopyButton,
        tooltipProps,
        isMultiLine,
        getSnippetProps,
        getCopyButtonProps
    } = useSnippet<TooltipProps, IconButtonProps>({ ...props, ref });

    const contents = useMemo(() => {
        const clonedCheckIcon = checkIcon && cloneElement(checkIcon, { "data-part": "check-icon" });
        const clonedCopyIcon = copyIcon && cloneElement(copyIcon, { "data-part": "copy-icon" });

        if (hideCopyButton) {
            return null;
        }

        return (
            <Tooltip
                hasArrow
                isDisabled={
                    copied || tooltipProps.isDisabled || disableTooltip || props.disableCopy
                }
                {...tooltipProps}
            >
                <IconButton
                    icon={copied ? clonedCheckIcon : clonedCopyIcon}
                    size={"sm"}
                    variant={"ghost"}
                    {...getCopyButtonProps()}
                />
            </Tooltip>
        );
    }, [
        hideCopyButton,
        getCopyButtonProps,
        tooltipProps,
        disableTooltip,
        copied,
        checkIcon,
        copyIcon,
        props.disableCopy
    ]);

    const preContent = useMemo(() => {
        if (isMultiLine && children && Array.isArray(children)) {
            return (
                <div data-part="content">
                    {children.map((t, index) => (
                        <pre
                            data-part="pre"
                            key={`${index}-${t}`}
                            tabIndex={0}
                        >
                            {!hideSymbol && <span data-part="symbol">{symbolBefore}</span>}
                            {t}
                        </pre>
                    ))}
                </div>
            );
        }

        return (
            <pre
                data-part="pre"
                ref={preRef}
                tabIndex={0}
            >
                {!hideSymbol && <span data-part="symbol">{symbolBefore}</span>}
                {children}
            </pre>
        );
    }, [children, hideSymbol, isMultiLine, symbolBefore, preRef]);

    return (
        <StyledSnippet {...getSnippetProps()}>
            {preContent}
            {contents}
        </StyledSnippet>
    );
});

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function CopyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect
                height="14"
                rx="2"
                ry="2"
                width="14"
                x="8"
                y="8"
            />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}
