import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/globals.css";
import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);
