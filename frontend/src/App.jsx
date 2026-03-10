import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import PrivateRouter from "./components/PrivateRouter";

import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Seller from "./pages/Seller";
import Home from "./pages/Home";
import Support from "./pages/Support";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route element={<PrivateRouter />}>
        <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* ===== PUBLIC OPTIONAL PAGES ===== */}
        <Route path="/seller" element={<Seller />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;