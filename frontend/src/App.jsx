import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRouter from "./components/PrivateRouter";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Seller from "./pages/Seller";
import Support from "./pages/Support";
import Address from "./pages/Address";

import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <WishlistProvider>
      <Router>

        <Navbar />
         <div className="pt-24"></div>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES */}
          <Route element={<PrivateRouter />}>

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/address" element={<Address />} />

          </Route>

          {/* OPTIONAL ROUTES */}
          <Route path="/seller" element={<Seller />} />
          <Route path="/support" element={<Support />} />

        </Routes>

      </Router>
    </WishlistProvider>
  );
}

export default App;