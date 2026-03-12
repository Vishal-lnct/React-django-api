import { createContext, useContext, useEffect, useState, useCallback } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [wishlistItems, setWishlistItems] = useState([]);

  // ======================
  // FETCH WISHLIST
  // ======================
  const fetchWishlist = useCallback(async () => {

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {

      const res = await fetch(`${BASEURL}/api/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await res.json();

      setWishlistItems(data);

    } catch (error) {
      console.error("Wishlist fetch error:", error);
    }

  }, [BASEURL]);

  // ======================
  // LOAD ON APP START
  // ======================
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        setWishlistItems,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);