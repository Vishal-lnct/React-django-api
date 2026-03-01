import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // ✅ control cancel loading

  // ===============================
  // FETCH ORDERS
  // ===============================
  const fetchOrders = () => {
    axios
      .get("http://127.0.0.1:8000/api/orders/", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
      .then((res) => {
        console.log("API RESPONSE:", res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log("Order fetch error:", err);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // CANCEL ORDER
  // ===============================
  const cancelOrder = async (orderId) => {
    try {
      setLoadingId(orderId); // ✅ disable button while cancelling

      await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Cannot cancel this order");
    } finally {
      setLoadingId(null);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="px-10 py-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => {
          const status = order.status?.toLowerCase() || "pending";

          return (
            <div
              key={order.id}
              className="border rounded-lg p-5 mb-6 shadow"
            >
              <h3 className="font-semibold mb-2">
                Order #{order.id}
              </h3>

              {/* ========= STATUS ========= */}
              <p className="mb-3">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    status === "pending"
                      ? "text-orange-500"
                      : status === "cancelled"
                      ? "text-red-500"
                      : status === "delivered"
                      ? "text-green-600"
                      : "text-blue-500"
                  }`}
                >
                  {status}
                </span>
              </p>

              {/* ========= ITEMS ========= */}
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 mb-3"
                >
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded border"
                  />

                  <div>
                    <p className="font-medium">
                      {item.product_name}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}

              {/* ========= TOTAL ========= */}
              <div className="font-bold mt-3">
                Total: ₹{order.total_amount}
              </div>

              {/* ========= CANCEL BUTTON ========= */}
              {status === "pending" && (
                <button
                  disabled={loadingId === order.id}
                  onClick={() => cancelOrder(order.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  {loadingId === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyOrders;