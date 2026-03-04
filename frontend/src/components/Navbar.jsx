import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { clearTokens } from "../utils/auth";
import { getCategories } from "../utils/api";
import { useState, useRef, useEffect } from "react";

function Navbar() {

  const { cartItems, refreshCartAuth, token } = useCart();
  const { wishlistItems } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [locationText, setLocationText] = useState("Location not set");

  const menuRef = useRef(null);

  // ACTIVE CATEGORY
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category");

  // LOAD CATEGORIES
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // LOAD LOCATION
  useEffect(() => {
    const savedLocation = localStorage.getItem("delivery_location");
    if (savedLocation) {
      setLocationText(savedLocation);
    }
  }, []);

  // SEARCH
  useEffect(() => {

    const debounce = setTimeout(() => {

      const query = search.trim();

      if (query === "") {
        navigate("/");
      } else {
        navigate(`/?search=${encodeURIComponent(query)}`);
      }

    }, 400);

    return () => clearTimeout(debounce);

  }, [search]);

  // CART COUNT
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlistItems.length;

  // LOGOUT
  const handleLogout = () => {
    clearTokens();
    refreshCartAuth();
    navigate("/login");
  };

  // CLOSE ACCOUNT MENU
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // CATEGORY CLICK
  const handleCategoryClick = (slug) => {
    if (!slug) navigate("/");
    else navigate(`/?category=${slug}`);
  };

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-10 py-4 flex items-center">

      {/* LEFT */}
      <div className="flex items-center gap-10">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-2">

          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            V
          </div>

          <span className="text-2xl font-bold text-gray-800">
            yntra
          </span>

        </NavLink>

        {/* CATEGORIES */}
        <div className="hidden md:flex items-center gap-6">

          <button
            onClick={() => handleCategoryClick("")}
            className={`font-medium ${
              !activeCategory
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (

            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`font-medium ${
                activeCategory === cat.slug
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {cat.name}
            </button>

          ))}

        </div>

      </div>

      {/* SEARCH */}
      <div className="flex-1 flex justify-center">

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-xl"
        >

          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none"
          />

          <button
            type="button"
            className="bg-purple-600 text-white px-6 rounded-r-lg"
          >
            Search
          </button>

        </form>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 ml-auto">

        {/* LOCATION */}
        <div
          onClick={() => navigate("/address")}
          className="text-sm cursor-pointer hover:text-purple-600"
        >
          📍 {locationText}
        </div>

        {/* ACCOUNT */}
        <div className="relative" ref={menuRef}>

          <button
            onClick={() =>
              token ? setShowMenu(!showMenu) : navigate("/login")
            }
            className="font-medium text-gray-700"
          >
            {token ? "Account ▾" : "Login"}
          </button>

          {showMenu && token && (

            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-lg p-4 border">

              <NavLink to="/profile" className="block mb-2">
                👤 My Profile
              </NavLink>

              <NavLink to="/orders" className="block mb-2">
                📦 Orders
              </NavLink>

              <NavLink to="/wishlist" className="block mb-2">
                ❤️ Wishlist
              </NavLink>

              <hr className="my-2" />

              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>

            </div>

          )}

        </div>

        {/* WISHLIST */}
        <NavLink
          to="/wishlist"
          className="relative"
        >
          ❤️ Wishlist

          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
              {wishlistCount}
            </span>
          )}

        </NavLink>

        {/* CART */}
        <button
          onClick={() => {
            if (!token) navigate("/login");
            else navigate("/cart");
          }}
          className="relative"
        >

          🛒 Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}

        </button>

      </div>

    </nav>
  );
}

export default Navbar;