import { DreamyProvider } from "@dreamy-ui/react";
import { type RenderOptions, render } from "@testing-library/react";
import { domMax } from "motion/react";
import type { ReactElement, ReactNode } from "react";

interface TestProviderProps {
    children: ReactNode;
}

function TestProvider({ children }: TestProviderProps) {
    return (
        <DreamyProvider
            colorMode="light"
            motionFeatures={domMax}
            reduceMotion={true}
        >
            {children}
        </DreamyProvider>
    );
}

function renderWithProvider(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
    return render(ui, { wrapper: TestProvider, ...options });
}

export { renderWithProvider as render };
