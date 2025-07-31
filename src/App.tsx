import { Route, Routes } from "react-router-dom";

import CartPage from "@/pages/cart";
import IndexPage from "@/pages/index";
import InsurancePage from "./pages/insurance";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import ProtectedRoute from "./auth/ProtectedRoute";
import NewClaimPage from "./pages/new-claim";
import ClaimDetailsPage from "./pages/ClaimDetailsPage";
import ClaimsCentrePage from "./pages/ClaimsCentrePage";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<InsurancePage />} path="/get-insurance/:productId" />
      <Route element={<CartPage />} path="/cart" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<ProfilePage />} path="/profile" />
        <Route element={<NewClaimPage />} path="/new-claim" />
        <Route element={<ClaimDetailsPage />} path="/claim/:claimNo" />
        <Route element={<ClaimsCentrePage />} path="/claims-centre" />
      </Route>
    </Routes>
  );
}

export default App;
