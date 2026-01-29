import { useState, useEffect } from "react";
import ProductCardMain from "../../components/Homeuser/Product/ProductCardMain";

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost/Traditional_Care/backend/api/jsone.php")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((p) => (
          <ProductCardMain key={p.id} product={p} onAddToCart={onAddToCart} />
        ))
      ) : (
        <p className="text-gray-500 col-span-full">No products found</p>
      )}
    </div>
  );
}
