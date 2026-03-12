import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { clearTokens } from "../utils/auth";
import { getCategories } from "../utils/api";
import { useState, useRef, useEffect } from "react";

function Navbar() {

  const { cartItems, refreshCartAuth, token } = useCart();
  const { wishlistItems } = useWishlist();

  const wishlistCount = wishlistItems?.length || 0;

  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const menuRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category");

  // ======================
  // LOAD CATEGORIES
  // ======================
  useEffect(() => {

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    loadCategories();

  }, []);

  // ======================
  // SEARCH DEBOUNCE
  // ======================
  useEffect(() => {

    if (!search.trim()) return;

    const debounce = setTimeout(() => {

      const query = search.trim();

      navigate(`/?search=${encodeURIComponent(query)}`);

    }, 400);

    return () => clearTimeout(debounce);

  }, [search, navigate]);

  // ======================
  // CART COUNT
  // ======================
  const cartCount = cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {

    clearTokens();
    refreshCartAuth();
    navigate("/login");

  };

  // ======================
  // CLOSE ACCOUNT MENU
  // ======================
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

  // ======================
  // CATEGORY CLICK
  // ======================
  const handleCategoryClick = (slug) => {

    if (!slug) {
      navigate("/");
    } else {
      navigate(`/?category=${slug}`);
    }

  };

  return (

    <nav className="bg-white/80 backdrop-blur-md shadow-md px-10 py-4 flex items-center sticky top-0 z-50">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-10">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-2 group">

          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105">
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
          className="flex w-full max-w-2xl"
        >

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded-l-full"
          />

          <button
            type="button"
            className="bg-purple-600 text-white px-6 rounded-r-full"
          >
            Search
          </button>

        </form>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-8 ml-auto">

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

              <NavLink to="/profile" className="block mb-2 hover:text-purple-600">
                👤 My Profile
              </NavLink>

              <NavLink to="/orders" className="block mb-2 hover:text-purple-600">
                📦 Orders
              </NavLink>

              <hr className="my-2" />

              <button
                onClick={handleLogout}
                className="text-red-500 font-medium hover:text-red-600"
              >
                Logout
              </button>

            </div>

          )}

        </div>

        {/* WISHLIST */}
        <NavLink
          to="/wishlist"
          className="flex items-center gap-1 text-gray-700 font-medium"
        >
          ❤️ Wishlist

          {wishlistCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {wishlistCount}
            </span>
          )}

        </NavLink>

        {/* CART */}
        <NavLink
          to="/cart"
          className="flex items-center gap-1 text-gray-700 font-medium"
        >

          🛒 Cart

          {cartCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}

        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;