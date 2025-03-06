import { Route, Routes } from "react-router-dom";

import CartPage from "@/pages/cart";
import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CartPage />} path="/cart" />

    </Routes>
  );
}

export default App;
