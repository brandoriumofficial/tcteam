import { useState } from "react";
import { FaStar, FaCartPlus, FaPlus, FaMinus, FaGift } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductCardMain({ product, onAddToCart }) {
  const [qty, setQty] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleAddToCart = () => {
    if (qty === 0) {
      setQty(1);
      onAddToCart(product, selectedSize, 1);
    }
  };

  const increaseQty = () => {
    setQty(qty + 1);
    onAddToCart(product, selectedSize, qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 0) {
      setQty(qty - 1);
      onAddToCart(product, selectedSize, qty - 1);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white hover:shadow-xl transition relative group">

      {/* Offer / Countdown */}
      {product.countdown_offer?.is_active && (
        <div className="absolute top-2 left-2 bg-orange-100 text-orange-800 px-2 py-1 text-xs rounded flex items-center gap-1 shadow-md z-10">
          <FaGift /> {product.countdown_offer.title}
        </div>
      )}

      <div className="mb-3 relative">
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-full h-44 object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="mb-2">
        <h3 className="font-semibold text-green-700 text-lg">{product.name}</h3>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>

<div className="mb-3 grid grid-cols-2 gap-2 items-center text-sm">
  <select
    value={selectedSize.size}
    onChange={(e) => {
      const size = product.sizes.find((s) => s.size === e.target.value);
      setSelectedSize(size);
    }}
    className="px-2 py-1 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    {product.sizes.map((size) => (
      <option key={size.size} value={size.size}>
        {size.size}
      </option>
    ))}
  </select>

  <div className="font-semibold text-green-700">
    price = ₹{selectedSize.final_price}
  </div>
</div>


      <div className="flex items-center gap-1 mb-3">
        <FaStar className="text-yellow-400" />
        <span className="text-sm font-medium">{product.rating.average}</span>
        <span className="text-xs text-gray-500">({product.rating.total_reviews})</span>
         <Link
         style={{marginLeft:'auto'}}
        to={`/product/${product.id}`}
        className="text-sm text-blue-600 hover:underline mt-auto block text-center"
      >
        More Details
      </Link>
      </div>

      {qty === 0 ? (
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 mb-2 transition-colors"
        >
          <FaCartPlus /> Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between border rounded p-1 mb-2">
          <button
            onClick={decreaseQty}
            className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            <FaMinus />
          </button>
          <span className="text-sm font-medium">{qty}</span>
          <button
            onClick={increaseQty}
            className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
      )}

      {/* Buy Now */}
      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded mb-2 transition-colors">
        Buy Now
      </button>

     
    </div>
  );
}
