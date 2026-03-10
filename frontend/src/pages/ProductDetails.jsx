import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  // Fetch product
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


  // Check if product already in wishlist
  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) return;

    fetch(`${BASEURL}/api/wishlist/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        const exists = data.some(
          item => item.product.id === Number(id)
        );

        setIsWishlisted(exists);

      });

  }, [id, BASEURL]);


  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center mt-10">No product found</div>;


  const handleAddToCart = () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    addToCart(product.id);
  };


  // Toggle Wishlist
  const toggleWishlist = async () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      if (isWishlisted) {

        // REMOVE
        await fetch(`${BASEURL}/api/wishlist/remove/${product.id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsWishlisted(false);

      } else {

        // ADD
        await fetch(`${BASEURL}/api/wishlist/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: product.id
          })
        });

        setIsWishlisted(true);
      }

    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }

  };


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src={product.image}
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

            <div className="flex gap-4">

              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart 🛒
              </button>

              <button
                onClick={toggleWishlist}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
              </button>

            </div>

            <div className="mt-4">
              <Link
                to="/"
                className="text-blue-600 hover:underline"
              >
                ← Back to Home
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;