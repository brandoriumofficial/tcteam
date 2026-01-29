import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";

export default function Homecard({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch("http://localhost/Traditional_Care/backend/api/jsone.php")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Products fetch error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading products...</div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => {
        const primary = Array.isArray(p.image) ? p.image[0] : p.image;
        const secondary =
          Array.isArray(p.image) && p.image.length > 1 ? p.image[1] : primary;

        const isHovered = hovered === p.id;

        // Rating
        const rating = p.rating?.average ?? 0;

        // Offer
        let discountText = null;
        if (Array.isArray(p.offer) && p.offer.length > 0) {
          const offer = p.offer[0];
          discountText =
            offer.type === "percentage"
              ? `${offer.value}% OFF`
              : `₹${offer.value} OFF`;
        }

        return (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Product Image */}
            <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
              {discountText && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold z-20">
                  {discountText}
                </div>
              )}

              <img
                src={isHovered ? secondary : primary}
                alt={p.name}
                className="w-full h-full object-cover object-center transform transition-transform duration-300"
                style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
              />

              {/* Rating */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                {rating.toFixed(1)}
              </div>
            </div>

            {/* Product Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                {p.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {p.description}
              </p>

              {/* Sizes */}
              {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                <div className="space-y-1 text-sm">
                  {p.sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-gray-700"
                    >
                      <span>{s.size}</span>
                      <div>
                        <span className="font-bold text-green-700">
                          ₹{s.final_price}
                        </span>
                        {s.price > s.final_price && (
                          <span className="text-xs line-through text-gray-400 ml-2">
                            ₹{s.price}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={() =>
                  onAddToCart
                    ? onAddToCart(p, 1)
                    : alert(`Added ${p.name} to cart`)
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-green-600 text-white hover:bg-green-700"
              >
                <FaShoppingCart />
                Add to cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
