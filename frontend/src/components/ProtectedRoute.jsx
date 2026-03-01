import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProtectedRoute({ children }) {
  const { token } = useCart();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;