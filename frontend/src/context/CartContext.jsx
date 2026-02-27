import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState(getAccessToken());

  // =========================
  // Fetch Cart From Backend
  // =========================
  const fetchCart = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/cart/`);
      const data = await res.json();

      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      clearCart();
    }
  };

  // =========================
  // React To Login / Logout
  // =========================
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      clearCart();
    }
  }, [token]);

  // =========================
  // Add To Cart
  // =========================
  const addToCart = async (productId) => {
    try {
      await authFetch(`${BASEURL}/api/cart/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // =========================
  // Remove From Cart
  // =========================
  const removeFromCart = async (itemId) => {
    try {
      await authFetch(`${BASEURL}/api/cart/remove/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // =========================
  // Update Quantity
  // =========================
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await authFetch(`${BASEURL}/api/cart/update/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // =========================
  // Clear Cart (Logout)
  // =========================
  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  // =========================
  // Refresh Auth (Login/Logout Trigger)
  // =========================
  const refreshCartAuth = () => {
    setToken(getAccessToken());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        refreshCartAuth,   // 🔥 IMPORTANT
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);