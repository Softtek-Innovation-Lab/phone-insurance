import { GlobalStoreProvider } from "./providers/GlobalStoreProvider";
import { Provider as ReduxProvider } from "react-redux"; 
import { store } from "@/store";
import NotificationProvider from "./providers/NotificationProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <GlobalStoreProvider>
        {/* GlobalStoreProvider ya incluye HeroUIProvider */}
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </GlobalStoreProvider>
    </ReduxProvider>
  );
}
