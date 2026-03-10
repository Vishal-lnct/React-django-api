import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlist = async () => {

    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {

      const res = await fetch(`${BASEURL}/api/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setWishlistCount(data.length);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistCount, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);