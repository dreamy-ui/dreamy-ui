"use client";

import {
    StepperProvider,
    type UseStepperProps,
    type UseStepperReturn,
    useStepper,
    useStepperContext
} from "@dreamy-ui/react";
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
export const Root = withProvider(function StepperRoot(props: StepperRootProps) {
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
                {...ctx.getRootProps()}
                {...rest}
            >
                {children}
            </dreamy.div>
        </StepperProvider>
    );
}, "root");

export interface StepperListProps extends HTMLDreamyProps<"ol"> {}

export const List = withContext(function StepperList(props: StepperListProps) {
    const { getListProps } = useStepperContext();

    return (
        <dreamy.ol
            {...getListProps()}
            {...props}
        />
    );
}, "list");

export interface StepperItemProps extends Omit<HTMLDreamyProps<"li">, "title"> {
    index: number;
}

export const Item = withContext(function StepperItem(props: StepperItemProps) {
    const { index, children, ...rest } = props;
    const { getItemProps } = useStepperContext();

    return (
        <dreamy.li
            {...getItemProps(index)}
            {...rest}
        >
            {children}
        </dreamy.li>
    );
}, "item");

export interface StepperTriggerProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Trigger = withContext(function StepperTrigger(props: StepperTriggerProps) {
    const { index, children, ...rest } = props;
    const { getTriggerProps } = useStepperContext();

    return (
        <dreamy.div
            {...getTriggerProps(index)}
            {...rest}
        >
            {children}
        </dreamy.div>
    );
}, "trigger");

export interface StepperIndicatorProps extends HTMLDreamyProps<"div"> {
    index: number;
    /**
     * Custom icon to show in the indicator for all states.
     * When provided, overrides the default number and check icon.
     */
    icon?: React.ReactNode;
}

export const Indicator = withContext(function StepperIndicator(props: StepperIndicatorProps) {
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
            {...getIndicatorProps(index)}
            {...rest}
        >
            {renderContent()}
        </dreamy.div>
    );
}, "indicator");

export interface StepperTitleProps extends HTMLDreamyProps<"p"> {}

export const Title = withContext(function StepperTitle(props: StepperTitleProps) {
    return <dreamy.p {...props} />;
}, "title");

export interface StepperDescriptionProps extends HTMLDreamyProps<"p"> {}

export const Description = withContext(function StepperDescription(props: StepperDescriptionProps) {
    return <dreamy.p {...props} />;
}, "description");

export interface StepperSeparatorProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Separator = withContext(function StepperSeparator(props: StepperSeparatorProps) {
    const { index, ...rest } = props;
    const { getSeparatorProps } = useStepperContext();

    return (
        <dreamy.div
            {...getSeparatorProps(index)}
            {...rest}
        />
    );
}, "separator");

export interface StepperContentProps extends HTMLDreamyProps<"div"> {
    index: number;
}

export const Content = withContext(function StepperContent(props: StepperContentProps) {
    const { index, ...rest } = props;
    const { getContentProps } = useStepperContext();

    return (
        <dreamy.div
            {...getContentProps(index)}
            {...rest}
        />
    );
}, "content");

export interface StepperCompletedContentProps extends HTMLDreamyProps<"div"> {}

export const CompletedContent = withContext(function StepperCompletedContent(
    props: StepperCompletedContentProps
) {
    const { isComplete } = useStepperContext();

    if (!isComplete) return null;

    return <dreamy.div {...props} />;
}, "completedContent");

export interface StepperNextTriggerProps extends HTMLDreamyProps<"button"> {}

export const NextTrigger = withContext(function StepperNextTrigger(props: StepperNextTriggerProps) {
    const { getNextTriggerProps } = useStepperContext();

    return (
        <dreamy.button
            {...getNextTriggerProps()}
            {...props}
        />
    );
}, "nextTrigger");

export interface StepperPrevTriggerProps extends HTMLDreamyProps<"button"> {}

export const PrevTrigger = withContext(function StepperPrevTrigger(props: StepperPrevTriggerProps) {
    const { getPrevTriggerProps } = useStepperContext();

    return (
        <dreamy.button
            {...getPrevTriggerProps()}
            {...props}
        />
    );
}, "prevTrigger");

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
