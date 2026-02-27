import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAccessToken, clearTokens } from "../utils/auth";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  
  const { cartItems, refreshCartAuth, token } = useCart();
  const navigate = useNavigate();
  // const token = getAccessToken();

  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

 const handleLogout = () => {
  clearTokens();        // ✅ use utility
  refreshCartAuth();    // ✅ update CartContext state
  navigate("/login");
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleSearch = (e) => {
  e.preventDefault();

  if (!search || search.trim() === "") {
    navigate("/");   // go to normal homepage
  } else {
    navigate(`/?search=${search.trim()}`);
  }
};

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-10 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* ===== LEFT: VYNTRA LOGO ===== */}
      <NavLink to="/" className="flex items-center gap-2 group">
        <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition duration-300 group-hover:scale-105">
          V
        </div>
        <span className="text-2xl font-bold text-gray-800 tracking-wide group-hover:text-black transition">
          yntra
        </span>
      </NavLink>

      {/* ===== CENTER: SEARCH BAR ===== */}
      <div className="flex-1 mx-12 max-w-2xl">
        <form onSubmit={handleSearch} className="flex shadow-sm">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 rounded-r-full hover:opacity-90 transition">
            Search
          </button>
        </form>
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-8">

        {/* ===== LOGIN DROPDOWN ===== */}
       {/* ===== LOGIN DROPDOWN ===== */}
<div className="relative" ref={menuRef}>

  <button
    onClick={() => setShowMenu(!showMenu)}
    className="font-medium text-gray-700 hover:text-black transition flex items-center"
  >
    {token ? "Account" : "Login"} <span className="ml-1">▾</span>
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-lg p-4 border animate-fadeIn z-50">

      {/* Show Sign Up only if NOT logged in */}
      {!token && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">
            New customer?
          </span>
          <NavLink
            to="/signup"
            className="text-purple-600 font-medium hover:underline"
            onClick={() => setShowMenu(false)}
          >
            Sign Up
          </NavLink>
        </div>
      )}

      <div className="flex flex-col gap-3 text-sm text-gray-700">
        <NavLink to="/profile">👤 My Profile</NavLink>
        <NavLink to="/orders">📦 Orders</NavLink>
        <NavLink to="/wishlist">❤️ Wishlist</NavLink>
        <NavLink to="/seller">🏪 Become a Seller</NavLink>
        <NavLink to="/support">🎧 24x7 Support</NavLink>
      </div>

      {/* Show Logout only if logged in */}
      {token && (
        <>
          <hr className="my-3" />
          <button
            onClick={handleLogout}
            className="text-red-500 font-medium text-left"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )}
</div>

        {/* ===== CART ===== */}
        <NavLink
          to="/cart"
          className="relative text-gray-700 hover:text-black font-medium transition hover:scale-105"
        >
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-bounce">
              {cartCount}
            </span>
          )}
        </NavLink>

      </div>
    </nav>
  );
}

export default Navbar;