import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import whatsappGif from "../pic/facewashpic.avif"; // Add your GIF here

const WhatsAppSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    problem: "",
    product: "",
  });

  const products = [
    "Face Wash",
    "Face Cream",
    "Hair Oil",
    "Shampoo",
    "Conditioner",
    "Soap",
    "Moisturizer",
    "Toner",
    "Hair Spray",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  if (!form.name || !form.problem) {
    alert("Please fill all required fields!");
    return;
  }

  const message = `Hi, my name is ${form.name}. I have a problem regarding ${
    form.product || "your products"
  }: ${form.problem}`;

  try {
    const res = await fetch("http://localhost/Traditional_Care/backend/api/whatsapp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+919714128062", // your WhatsApp number here
        message,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Message sent successfully!");
      setIsOpen(false);
      setForm({ name: "", problem: "", product: "" });
    } else {
      alert("❌ Failed to send: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Something went wrong!");
  }
};

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 cursor-pointer z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <img src={whatsappGif} alt="WhatsApp Support" className="w-16 h-16" />
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white w-full sm:w-96 p-6 rounded-l-2xl shadow-xl relative"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()} // prevent closing on inner click
            >
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                WhatsApp Support
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-green-500"
              />

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-green-500"
              >
                <option value="">Select Product (optional)</option>
                {products.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <textarea
                name="problem"
                placeholder="Describe your problem"
                value={form.problem}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-green-500"
                rows={4}
              ></textarea>

              <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-all"
              >
                Submit
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppSupport;
