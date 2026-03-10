import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    // If user not logged in → redirect
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BASEURL}/api/wishlist/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        return res.json();
      })
      .then(data => {
        console.log("Wishlist data:", data);
        setWishlist(data);
      })
      .catch(err => console.error(err));

  }, [BASEURL, navigate]);


  const removeFromWishlist = async (productId) => {

    const token = localStorage.getItem("access_token");

    try {

      await fetch(`${BASEURL}/api/wishlist/remove/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // update UI instantly
      setWishlist(
        wishlist.filter(item => item.product.id !== productId)
      );

    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };


  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        ❤️ My Wishlist
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {wishlist.length === 0 ? (
          <p>No products in wishlist</p>
        ) : (
          wishlist.map((item) => (

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

          ))
        )}

      </div>

    </div>
  );
}

export default Wishlist;