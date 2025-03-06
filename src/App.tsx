import { Route, Routes } from "react-router-dom";

import CartPage from "@/pages/cart";
import IndexPage from "@/pages/index";
import InsurancePage from "./pages/insurance";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<InsurancePage />} path="/get-insurance" />
      <Route element={<CartPage />} path="/cart" />

    </Routes>
  );
}

export default App;
