// hooks/useGlobalStore.ts
import { useContext } from "react";
import { GlobalStoreContext } from "../providers/GlobalStoreProvider";

export function useGlobalStore(): GlobalStoreContextType {
    const context = useContext(GlobalStoreContext);
    if (!context) {
        throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
    }
    return context;
}