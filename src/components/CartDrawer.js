import React from "react";

export default function CartDrawer({ cartItems, onClose }) {
  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 p-4 overflow-y-auto">
      <button
        className="text-gray-600 hover:text-gray-900 font-bold mb-4"
        onClick={onClose}
      >
        ✖ Close
      </button>
      <h2 className="text-lg font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        cartItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b py-3 last:border-none"
          >
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="w-12 h-12 object-contain"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-green-600 font-semibold">₹{item.final_price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
