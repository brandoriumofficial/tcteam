export default function Cart({ cart, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.final_price, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white p-3 shadow rounded-xl">
                <span>{item.name}</span>
                <span>₹{item.final_price}</span>
                <button
                  onClick={() => onRemove(idx)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 font-bold text-green-700">Total: ₹{total}</div>
          <button className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500">
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
