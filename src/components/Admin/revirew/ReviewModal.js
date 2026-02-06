// ReviewModal.js
import React, { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const ReviewModal = ({ show, onClose, onAddReview }) => {
  const [review, setReview] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!review.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!review.comment.trim()) {
      newErrors.comment = "Review comment is required";
    }
    
    if (review.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.email)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddReview({
        ...review,
        id: Date.now(),
        verified: false,
        helpful: 0,
        notHelpful: 0
      });
      setReview({
        name: "",
        email: "",
        rating: 5,
        title: "",
        comment: "",
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setReview(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Add Review</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FaTimesCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={review.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={review.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleChange('rating', star)}
                      className="text-2xl hover:scale-110 transition"
                    >
                      {star <= review.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{review.rating}/5</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={review.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Great product!"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                value={review.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                rows="4"
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-200 outline-none ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share your experience with this product..."
              />
              {errors.comment && (
                <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;