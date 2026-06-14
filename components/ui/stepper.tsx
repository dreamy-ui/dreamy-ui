"use client";

import {
    StepperProvider,
    type UseStepperReturn,
    type UseStepperProps,
    useStepper,
    useStepperContext
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { StepperVariantProps } from "styled-system/recipes";
import { stepper } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stepper);

export interface StepperRootProps
    extends UseStepperProps,
        Omit<HTMLDreamyProps<"div">, "id">,
        StepperVariantProps {}

/**
 * Stepper component
 *
 * @See Docs https://dreamy-ui.com/docs/components/stepper
 */
export const Root = withProvider(
    forwardRef<HTMLDivElement, StepperRootProps>(function StepperRoot(props, ref) {
        const {
            count,
            defaultStep,
            step,
            onStepChange,
            orientation = "horizontal",
            id,
            children,
            ...rest
        } = props;

        const ctx = useStepper({
            count,
            defaultStep,
            step,
            onStepChange,
            orientation,
            id
        });

        return (
            <StepperProvider value={ctx}>
                <dreamy.div
                    ref={ref}
                    {...ctx.getRootProps()}
                    {...rest}
                >
                    {children}
                </dreamy.div>
            </StepperProvider>
        );
    }),
    "root"
);

export interface StepperListProps extends HTMLDreamyProps<"ol"> {}

export const List = withContext(
    forwardRef<HTMLOListElement, StepperListProps>(function StepperList(props, ref) {
        const { getListProps } = useStepperContext();

        return (
            <dreamy.ol
                ref={ref}
                {...getListProps()}
                {...props}
            />
        );
    }),
    "list"
);

export interface StepperItemProps extends Omit<HTMLDreamyProps<"li">, "title"> {
    index: number;
}

export const Item = withContext(
    forwardRef<HTMLLIElement, StepperItemProps>(function StepperItem(props, ref) {
        const { index, children, ...rest } = props;
        const { getItemProps } = useStepperContext();

        return (
            <dreamy.li
                ref={ref}
                {...getItemProps(index)}
                {...rest}
            >
                {children}
            </dreamy.li>
        );
    }),
    "item"
);

export interface StepperTriggerProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Trigger = withContext(
    forwardRef<HTMLDivElement, StepperTriggerProps>(function StepperTrigger(props, ref) {
        const { index, children, ...rest } = props;
        const { getTriggerProps } = useStepperContext();

        return (
            <dreamy.div
                ref={ref}
                {...getTriggerProps(index)}
                {...rest}
            >
                {children}
            </dreamy.div>
        );
    }),
    "trigger"
);

export interface StepperIndicatorProps extends HTMLDreamyProps<"div"> {
    index: number;
    /**
     * Custom icon to show in the indicator for all states.
     * When provided, overrides the default number and check icon.
     */
    icon?: React.ReactNode;
}

export const Indicator = withContext(
    forwardRef<HTMLDivElement, StepperIndicatorProps>(function StepperIndicator(props, ref) {
        const { index, icon, children, ...rest } = props;
        const { getIndicatorProps, step } = useStepperContext();

        function renderContent() {
            if (children) return children;
            if (icon) return icon;
            if (index < step) return <CheckIcon />;
            return index + 1;
        }

        return (
            <dreamy.div
                ref={ref}
                {...getIndicatorProps(index)}
                {...rest}
            >
                {renderContent()}
            </dreamy.div>
        );
    }),
    "indicator"
);

export interface StepperTitleProps extends HTMLDreamyProps<"p"> {}

export const Title = withContext(
    forwardRef<HTMLParagraphElement, StepperTitleProps>(function StepperTitle(props, ref) {
        return (
            <dreamy.p
                ref={ref}
                {...props}
            />
        );
    }),
    "title"
);

export interface StepperDescriptionProps extends HTMLDreamyProps<"p"> {}

export const Description = withContext(
    forwardRef<HTMLParagraphElement, StepperDescriptionProps>(
        function StepperDescription(props, ref) {
            return (
                <dreamy.p
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "description"
);

export interface StepperSeparatorProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Separator = withContext(
    forwardRef<HTMLDivElement, StepperSeparatorProps>(function StepperSeparator(props, ref) {
        const { index, ...rest } = props;
        const { getSeparatorProps } = useStepperContext();

        return (
            <dreamy.div
                ref={ref}
                {...getSeparatorProps(index)}
                {...rest}
            />
        );
    }),
    "separator"
);

export interface StepperContentProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Content = withContext(
    forwardRef<HTMLDivElement, StepperContentProps>(function StepperContent(props, ref) {
        const { index, ...rest } = props;
        const { getContentProps } = useStepperContext();

        return (
            <dreamy.div
                ref={ref}
                {...getContentProps(index)}
                {...rest}
            />
        );
    }),
    "content"
);

export interface StepperCompletedContentProps extends HTMLDreamyProps<"div"> {}

export const CompletedContent = withContext(
    forwardRef<HTMLDivElement, StepperCompletedContentProps>(
        function StepperCompletedContent(props, ref) {
            const { isComplete } = useStepperContext();

            if (!isComplete) return null;

            return (
                <dreamy.div
                    ref={ref}
                    {...props}
                />
            );
        }
    ),
    "completedContent"
);

export interface StepperNextTriggerProps extends HTMLDreamyProps<"button"> {}

export const NextTrigger = withContext(
    forwardRef<HTMLButtonElement, StepperNextTriggerProps>(function StepperNextTrigger(props, ref) {
        const { getNextTriggerProps } = useStepperContext();

        return (
            <dreamy.button
                ref={ref}
                {...getNextTriggerProps()}
                {...props}
            />
        );
    }),
    "nextTrigger"
);

export interface StepperPrevTriggerProps extends HTMLDreamyProps<"button"> {}

export const PrevTrigger = withContext(
    forwardRef<HTMLButtonElement, StepperPrevTriggerProps>(function StepperPrevTrigger(props, ref) {
        const { getPrevTriggerProps } = useStepperContext();

        return (
            <dreamy.button
                ref={ref}
                {...getPrevTriggerProps()}
                {...props}
            />
        );
    }),
    "prevTrigger"
);

export interface StepperContextProps {
    children: (ctx: UseStepperReturn) => React.ReactNode;
}

export function Context({ children }: StepperContextProps) {
    const ctx = useStepperContext();
    return <>{children(ctx)}</>;
}

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
