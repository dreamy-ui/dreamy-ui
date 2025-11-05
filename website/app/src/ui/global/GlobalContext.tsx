import {
    type PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";
import { useRoot } from "~/src/hooks/useRoot";

export type PM = "npm" | "pnpm" | "yarn" | "bun";

export interface GlobalContextType {
    pm: PM;
    updatePm: (pm: PM) => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export default function GlobalContextProvider({ children }: PropsWithChildren) {
    const { pm: pmFromRoot } = useRoot();

    const [pm, setPm] = useState<PM>(() => {
        let pm: PM | undefined;

        const validPms = ["npm", "pnpm", "yarn", "bun"] as PM[];
        for (const p of validPms) {
            if (pmFromRoot === p) {
                pm = p as PM;
                break;
            }
        }

        if (!pm) {
            pm = validPms[1];
        }

        return pm ?? validPms[1];
    });

    const updatePm = useCallback((pm: PM) => {
        cookieStore.set({
            name: "pm",
            value: pm,
            path: "/",
            expires: Date.now() + 31536000000
        });
        setPm(pm);
    }, []);

    const memoizedValue = useMemo<GlobalContextType>(() => ({ pm, updatePm }), [pm, updatePm]);

    return <GlobalContext.Provider value={memoizedValue}>{children}</GlobalContext.Provider>;
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }

    return context;
}
