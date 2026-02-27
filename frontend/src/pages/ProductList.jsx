import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get("search");

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
    setLoading(true);
    setError(null);

    let url = `${BASEURL}/api/products/`;

    if (search && search.trim() !== "") {
        url += `?search=${search}`;
    }

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        })
        .then(data => {
            setProducts(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });

}, [search]);// 🔥 important dependency

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg font-medium">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-5 bg-white shadow-md">
                {search ? `Search Results for "${search}"` : "Product List"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No products found.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductList;