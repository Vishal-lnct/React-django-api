import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // ======================
  // READ URL PARAMS
  // ======================
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const category = params.get("category");

  // ======================
  // FETCH PRODUCTS
  // ======================
  useEffect(() => {
    let url = "http://127.0.0.1:8000/api/products/?";

    if (search) {
      url += `search=${search}&`;
    }

    if (category) {
      url += `category=${category}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [location.search]);

  // ======================
  // UI
  // ======================
  return (
    <div className="px-10 py-8">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-6">
        {search
          ? `Results for "${search}"`
          : category
          ? `Category: ${category}`
          : "All Products"}
      </h2>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="mt-3 font-semibold">
                {item.name}
              </h3>

              <p className="text-gray-600">
                ₹{item.price}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Home;