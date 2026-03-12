import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();

  const { wishlistItems, setWishlistItems, fetchWishlist } = useWishlist();

  // ======================
  // FETCH WISHLIST ON LOAD
  // ======================
  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchWishlist();

  }, [navigate, fetchWishlist]);


  // ======================
  // REMOVE PRODUCT
  // ======================
  const removeFromWishlist = async (productId) => {

    const token = localStorage.getItem("access_token");

    try {

      const res = await fetch(`${BASEURL}/api/wishlist/remove/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to remove product");
      }

      // Update UI instantly
      setWishlistItems(prev =>
        prev.filter(item => item.product.id !== productId)
      );

      // Sync context count (Navbar)
      fetchWishlist();

    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };


  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        ❤️ My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <p>No products in wishlist</p>
      ) : (

        <div className="grid grid-cols-3 gap-6">

          {wishlistItems.map((item) => (

            <div key={item.id} className="border p-4 rounded-lg">

              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-40 object-cover"
              />

              <h2 className="text-lg font-semibold mt-2">
                {item.product.name}
              </h2>

              <p className="text-green-600">
                ₹{item.product.price}
              </p>

              <button
                onClick={() => removeFromWishlist(item.product.id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Wishlist;