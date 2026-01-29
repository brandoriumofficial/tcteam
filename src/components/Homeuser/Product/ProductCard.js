import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductCard({ product, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations?.[0] || {}
  );

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({ ...product, selectedVariation });
    }
    toast.success(
      `${product.name} (${selectedVariation?.size || "default"}) added to cart!`
    );
  };

  const mainImage = product.image?.[0] || "https://via.placeholder.com/250";
  const hoverImage = product.image?.[1] || mainImage;

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl flex flex-col justify-between h-[500px] p-4 transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-40 mb-3">
        <img
          src={mainImage}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover rounded-xl transition-opacity duration-500 ease-in-out ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={hoverImage}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover rounded-xl transition-opacity duration-500 ease-in-out ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-green-800 font-semibold text-lg">{product.name}</h2>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        {product.variations?.length > 1 && (
          <div className="mt-2">
            <label className="text-gray-600 text-sm mr-2">Size:</label>
            <select
              value={selectedVariation?.size || ""}
              onChange={(e) =>
                setSelectedVariation(
                  product.variations.find((v) => v.size === e.target.value) || {}
                )
              }
              className="border rounded px-2 py-1 text-sm"
            >
              {product.variations.map((v) => (
                <option key={v.size} value={v.size}>
                  {v.size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-green-700 font-bold text-lg">
            ₹{selectedVariation?.final_price || product.final_price || product.price}
          </span>
          {selectedVariation?.discount > 0 && (
            <span className="line-through text-gray-400 text-sm">
              ₹{selectedVariation?.price || product.price}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400">★</span>
          <span className="text-gray-600 text-sm">{product.rating?.average || "0"}</span>
          <span className="text-gray-400 text-xs">| {product.category}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 font-semibold w-1/2"
        >
          + Add
        </button>
        <Link
          to={`/product/${product.id}`}
          className="text-yellow-600 underline text-sm ml-2"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
