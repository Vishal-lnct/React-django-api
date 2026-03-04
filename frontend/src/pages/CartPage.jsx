import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {

  const { cartItems, total, removeFromCart, updateQuantity } = useCart();

  console.log("Cart Items:", cartItems);

  return (
    <div className="pt-24 min-h-screen bg-gray-100 px-6 py-8">

      <h1 className="text-3xl font-bold mb-8 text-center">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (

        <p className="text-center text-gray-600">
          Your cart is empty.
        </p>

      ) : (

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between py-4 border-b"
            >

              {/* PRODUCT LEFT SECTION */}
              <div className="flex items-center gap-4">

                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}

                <div>

                  <h2 className="text-lg font-semibold">
                    {item.product_name}
                  </h2>

                  <p className="text-gray-600">
                    ${item.product_price}
                  </p>

                </div>

              </div>


              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-3">

                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity > 1 ? item.quantity - 1 : 1
                    )
                  }
                >
                  -
                </button>

                <span className="font-medium">
                  {item.quantity}
                </span>

                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}


          {/* TOTAL SECTION */}
          <div className="pt-6 mt-4 flex justify-between items-center">

            <h2 className="text-xl font-bold">
              Total:
            </h2>

            <p className="text-xl font-semibold">
              ${total.toFixed(2)}
            </p>

            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>

      )}

    </div>
  );
}

export default CartPage;