import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-[#fdf6e4] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaCheckCircle className="text-5xl text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>

        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-bold text-[#2f7d32]">#{orderId}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Link to="/" className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
            <FaHome /> Home
          </Link>
          <Link to="/" className="flex-1 py-3 rounded-xl bg-[#2f7d32] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#246127] transition">
            <FaShoppingBag /> Shop More
          </Link>
        </div>
      </motion.div>
    </div>
  );
}