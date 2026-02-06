// src/pages/ViewProduct.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaImage, FaList, FaTag, FaStar } from "react-icons/fa";
import apiService from '../services/apiService';

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.message || 'Product not found');
        }
      } catch (err) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await apiService.deleteProduct(id);
        if (response.success) {
          alert('Product deleted successfully');
          navigate('/admin/products');
        } else {
          alert(response.message || 'Failed to delete product');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error || 'Product not found'}</p>
          <Link 
            to="/admin/products"
            className="mt-2 inline-block text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/products"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/products/edit/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaEdit /> Edit Product
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-200 transition"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap">
            {['details', 'images', 'variations', 'description', 'seo'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                {tab === 'details' && <FaList className="inline mr-2" />}
                {tab === 'images' && <FaImage className="inline mr-2" />}
                {tab === 'variations' && <FaList className="inline mr-2" />}
                {tab === 'description' && <FaTag className="inline mr-2" />}
                {tab === 'seo' && <FaStar className="inline mr-2" />}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Name:</dt>
                    <dd className="w-2/3 font-medium">{product.name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">SKU:</dt>
                    <dd className="w-2/3 font-mono">{product.sku || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Status:</dt>
                    <dd className="w-2/3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status}
                      </span>
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Price:</dt>
                    <dd className="w-2/3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₹{product.sale_price || product.base_price || 0}</span>
                        {product.base_price > product.sale_price && (
                          <span className="text-gray-400 line-through">₹{product.base_price}</span>
                        )}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Inventory & Stock</h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Stock Qty:</dt>
                    <dd className="w-2/3 font-medium">{product.stock_qty || 0}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Stock Status:</dt>
                    <dd className="w-2/3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        product.stock_status === 'In Stock' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock_status}
                      </span>
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Manage Stock:</dt>
                    <dd className="w-2/3">
                      {product.manage_stock ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              {product.feature_image ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Featured Image</p>
                    <img 
                      src={product.feature_image} 
                      alt="Featured" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  {product.banner_image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Banner Image</p>
                      <img 
                        src={product.banner_image} 
                        alt="Banner" 
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  {product.side_image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Side Image</p>
                      <img 
                        src={product.side_image} 
                        alt="Side" 
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No images uploaded</p>
              )}
            </div>
          )}

          {/* Add other tab contents similarly */}
        </div>
      </div>
    </div>
  );
}