// providers/GlobalStoreProvider.tsx
import { HeroUIProvider } from "@heroui/system";
import { createContext, ReactNode, useEffect, useState } from "react";
import type { NavigateOptions } from "react-router-dom";
import { useHref, useNavigate } from "react-router-dom";

// Declare the router config extension
declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NavigateOptions;
    }
}

// Define the store context shape
export interface GlobalStoreContextType {
    store: Record<string, any>;
    setStore: (data: Record<string, any>) => void;
    clearStore: () => void;
}

// Create the context
export const GlobalStoreContext = createContext<GlobalStoreContextType | undefined>(undefined);

// LocalStorage key
const STORAGE_KEY = "globalStore";

// Provider component
export function GlobalStoreProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    // Initialize state from localStorage or use empty object
    const [store, setStoreState] = useState<Record<string, any>>(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : {};
    });

    // Sync store changes to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }, [store]);

    // Update store by merging new data with existing
    const setStore = (data: Record<string, any>) => {
        setStoreState((prev) => ({ ...prev, ...data }));
    };

    // Clear store and localStorage
    const clearStore = () => {
        setStoreState({});
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = {
        store,
        setStore,
        clearStore,
    };

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
            <GlobalStoreContext.Provider value={value}>
                {children}
            </GlobalStoreContext.Provider>
        </HeroUIProvider>
    );
}