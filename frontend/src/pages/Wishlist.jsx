import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-600">
          Your Wishlist is Empty ❤️
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-100 px-6 py-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        My Wishlist
      </h1>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {wishlistItems.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >

            {/* IMAGE */}
            <div className="h-48 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* PRODUCT INFO */}
            <div className="p-4">

              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>

              <p className="text-green-600 font-bold mt-1">
                ₹{item.price}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between items-center mt-4">

                <Link
                  to={`/product/${item.id}`}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View
                </Link>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 text-sm font-medium hover:text-red-600"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;