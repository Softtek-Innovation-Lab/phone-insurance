import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { GlobalStoreProvider } from "./providers/GlobalStoreProvider";
import { Provider as ReduxProvider } from "react-redux"; 
import { store } from "@/store";
import NotificationProvider from "./providers/NotificationProvider";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ReduxProvider store={store}>
      <GlobalStoreProvider>
        <NotificationProvider>
          <HeroUIProvider navigate={navigate} useHref={useHref}>
            {children}
          </HeroUIProvider>
        </NotificationProvider>
      </GlobalStoreProvider>
    </ReduxProvider>
  );
}
