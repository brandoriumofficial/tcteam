import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar, FaTag } from "react-icons/fa";
import StarRating from "../../components/Homeuser/rating/StarRating";

export default function ProductDetails({ onAddToCart }) {
  const [feedbackForm, setFeedbackForm] = useState({ user: "", stars: 0, comment: "" });
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState({});
  const [countdown, setCountdown] = useState(null);
  const [mainImage, setMainImage] = useState("");
  useEffect(() => {
    fetch("http://localhost/Traditional_Care/backend/api/jsone.php")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        const found = data.find((p) => p.id === id);
        setProduct(found || null);
        if (found?.image?.length) setMainImage(found.image[0]);
      })
      .catch((err) => console.error("API Error:", err));
  }, [id]);

  useEffect(() => {
    if (product?.variations?.length) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product?.countdown_offer?.is_active && product.offer?.length) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const offerEnd = new Date(product.offer[0].valid_to).getTime();
        const distance = offerEnd - now;
        if (distance < 0) {
          clearInterval(interval);
          setCountdown("Offer expired");
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    onAddToCart({ ...product, selectedVariation });
    toast.success(
      `${product.name} (${selectedVariation?.size || "default"}) added to cart!`
    );
  };

  // Handle feedback input changes
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.user || !feedbackForm.comment) {
      toast.error("Please enter your name and comment");
      return;
    }

    const newFeedback = {
      ...feedbackForm,
      stars: parseInt(feedbackForm.stars),
    };

    // Update local state (no backend here)
    setProduct((prev) => ({
      ...prev,
      feedback: prev.feedback ? [newFeedback, ...prev.feedback] : [newFeedback],
    }));

    toast.success("Feedback submitted!");
    setFeedbackForm({ user: "", stars: 5, comment: "" });
  };
  const handleStarChange = (star) => {
    setFeedbackForm({ ...feedbackForm, stars: star });
  };

  const similarProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <div className="bg-gray-50 min-h-screen py-6" style={{ marginTop: '40px' }}>
      {/* Product Details (same as your code) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 p-6 ">
        {/* Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {product.image?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${mainImage === img ? "border-green-500" : "border-gray-200"}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="flex items-center mt-4 gap-2">
              <FaStar className="text-yellow-500" />
              <span className="text-lg font-semibold">{product.rating?.average} / 5</span>
              <span className="text-gray-500 text-sm">({product.rating?.total_reviews} reviews)</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-2xl font-bold text-green-700">₹{product.final_price}</p>
              <p className="line-through text-gray-500">₹{product.price}</p>
              <p className="text-red-600 font-semibold">{product.discount}% OFF</p>
            </div>
            {product.offer?.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded">
                <h3 className="flex items-center font-semibold text-yellow-800 mb-2 gap-2">
                  <FaTag /> Offers:
                </h3>
                {product.offer.map((o, idx) => (
                  <p key={idx} className="text-yellow-700 text-sm mb-1">
                    {o.type === "flat" ? `Flat ₹${o.value} OFF` : `${o.value}% OFF`}
                    <span className="ml-1 text-gray-500 text-xs">
                      (Valid: {new Date(o.valid_from).toLocaleDateString()} - {new Date(o.valid_to).toLocaleDateString()})
                    </span>
                  </p>
                ))}
                {countdown && <p className="mt-1 font-semibold text-red-600 text-sm">Time left: {countdown}</p>}
                {product.combine_offers?.mode && (
                  <p className="mt-1 text-gray-600 text-xs">{product.combine_offers.rules[0]}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4 flex-wrap" style={{ width: "100%" }}>
            <button
              onClick={handleAdd}
              style={{ width: "40%" }}
              className="w-full sm:w-1/2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded transition duration-300 hover:bg-yellow-500 hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              style={{ width: "40%" }}
              className="w-full sm:w-1/2 px-6 py-3 bg-green-600 text-white font-semibold rounded transition duration-300 hover:bg-green-700 hover:scale-105"
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Customer Feedback</h2>

        {product.feedback?.length > 0 ? (
          product.feedback.map((f, idx) => (
            <div key={idx} className="border-b py-3">
              <p className="font-bold text-gray-800">{f.user}</p>
              <p className="flex items-center gap-1 text-yellow-500 text-sm">
                {Array.from({ length: f.stars }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </p>
              <p className="text-gray-600">{f.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No feedback yet.</p>
        )}

        <form onSubmit={handleFeedbackSubmit} className="mt-6 border-t pt-4 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Submit Your Feedback</h3>
          <input
            type="text"
            name="user"
            value={feedbackForm.user}
            onChange={handleFeedbackChange}
            placeholder="Your Name"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <StarRating value={feedbackForm.stars} onChange={handleStarChange} />
          <textarea
            name="comment"
            value={feedbackForm.comment}
            onChange={handleFeedbackChange}
            placeholder="Your Comment"
            rows="4"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Similar Products */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {similarProducts.map((sp, idx) => (
            <Link
              key={sp.id}
              to={`/product/${sp.id}`}
              className="bg-white rounded p-2 hover:bg-green-50 transition"
            >
              <img
                src={sp.image?.[0] || "https://via.placeholder.com/200"}
                alt={sp.name}
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm font-semibold truncate text-gray-700">{sp.name}</p>
              <p className="text-green-600 font-bold text-sm">₹{sp.final_price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
