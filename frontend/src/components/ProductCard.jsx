import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">

        <div className="w-full h-56 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full object-contain"
            onError={(e) => {
              e.target.src = "https://picsum.photos/400";
            }}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="text-gray-600 font-medium">
          ${product.price}
        </p>

      </div>
    </Link>
  );
}

export default ProductCard;