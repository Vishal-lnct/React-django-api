import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  // Wishlist context
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  const handleAddToCart = () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    addToCart(product.id);
  };

  const handleWishlist = () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex flex-col md:flex-row gap-8">

          <img
            src={`${product.image}`}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          />

          <div className="flex-1">

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <p className="text-2xl font-semibold text-green-600 mb-6">
              ₹{product.price}
            </p>

            {/* Buttons */}
            <div className="flex gap-4">

              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart 🛒
              </button>

              <button
                onClick={handleWishlist}
                className={`px-6 py-2 rounded-lg transition ${
                  isInWishlist(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {isInWishlist(product.id)
                  ? "❤️ Remove Wishlist"
                  : "🤍 Add to Wishlist"}
              </button>

            </div>

            {/* Back Button */}
            <div className="mt-4">
              <a
                href="/"
                className="text-blue-600 hover:underline"
              >
                &larr; Back to Home
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;