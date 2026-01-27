import React, { useState } from "react";
import { FaTimes, FaGift } from "react-icons/fa";

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onQuantityChange,
  onRemove,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "save10") {
      setDiscountApplied(10);
      alert("Coupon Applied! 10% discount applied.");
    } else {
      alert("Invalid Coupon Code");
      setDiscountApplied(0);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      (item.selectedVariation?.final_price || item.final_price) *
        item.quantity,
    0
  );

  const total = subtotal - (subtotal * discountApplied) / 100;

  return (
    <div
  className={`
    fixed right-0 
    top-[100px] md:top-[100px]
    h-[calc(100vh-120px)] md:h-[calc(100vh-84px)]
    w-full md:w-[420px]
    bg-white shadow-2xl z-[999]
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "translate-x-full"}
    flex flex-col
  `}
>

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-green-50">
        <h2 className="font-bold text-lg text-green-800">
          Your Cart ({cart.length})
        </h2>
        <button
          onClick={onClose}
          className="text-green-700 hover:text-green-900"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {cart.length === 0 && (
          <p className="text-gray-500">Cart is empty</p>
        )}

        {cart.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg hover:bg-green-50 transition"
          >
            {/* Accordion Header */}
            <div
              className="flex justify-between items-center p-2 cursor-pointer"
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
            >
              <div>
                <h3 className="font-semibold text-green-800">
                  {item.name}
                </h3>
                <span className="text-sm text-gray-600">
                  {item.selectedVariation?.size || "Default"}
                </span>
              </div>
              <span className="font-semibold text-gray-700">
                Qty: {item.quantity}
              </span>
            </div>

            {/* Accordion Body */}
            {expandedIndex === idx && (
              <div className="p-3 bg-green-50 space-y-2">
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />

                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>

                <p className="font-semibold text-green-700">
                  ₹
                  {(item.selectedVariation?.final_price ||
                    item.final_price) *
                    item.quantity}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-green-200 rounded"
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        item.selectedVariation?.size,
                        -1
                      )
                    }
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    className="px-3 py-1 bg-green-200 rounded"
                    onClick={() =>
                      onQuantityChange(
                        item.id,
                        item.selectedVariation?.size,
                        1
                      )
                    }
                  >
                    +
                  </button>

                  <button
                    className="ml-auto text-red-500 font-semibold"
                    onClick={() =>
                      onRemove(item.id, item.selectedVariation?.size)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coupon & Total */}
      <div className="p-4 border-t bg-green-50 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-3 py-2 bg-yellow-400 text-white rounded font-semibold flex items-center gap-1"
          >
            <FaGift /> Apply
          </button>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {discountApplied > 0 && (
          <div className="flex justify-between font-semibold">
            <span>Discount</span>
            <span>{discountApplied}%</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button className="w-full bg-green-500 text-white py-2 rounded font-semibold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
