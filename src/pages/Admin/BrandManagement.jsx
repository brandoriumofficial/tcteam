import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api/API_URL';
import { FaEye } from "react-icons/fa";
const API_URL1 = API_URL + '/admin/brands/index.php';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active'
  });

  // Fetch brands from API
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL1}?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`);
      const data = await response.json();
      
      if (data.success) {
        const brandsWithFullUrls = data.brands.map(brand => ({
          ...brand,
          image: brand.image ? `${API_URL}${brand.image}` : ''
        }));
        
        setBrands(brandsWithFullUrls);
        setFilteredBrands(brandsWithFullUrls);
        setStats(data.stats);
      } else {
        showToast(data.message || 'Failed to fetch brands', 'error');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      showToast('Failed to fetch brands', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData({ ...formData, [name]: value, slug: slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a valid image file (JPG, PNG, GIF, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size should be less than 5MB', 'error');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    setSaving(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('slug', formData.slug.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('status', formData.status);
      
      // Handle image
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.image && formData.image.startsWith('data:image')) {
        formDataToSend.append('imageBase64', formData.image);
      } else if (editingBrand && editingBrand.image) {
        // Send existing image path (remove API_URL prefix)
        const existingImagePath = editingBrand.image.replace(API_URL, '');
        formDataToSend.append('existingImage', existingImagePath);
      }

      let response;
      
      if (editingBrand) {
        // Update brand
        formDataToSend.append('id', editingBrand.id);
        formDataToSend.append('_method', 'PUT');
        
        response = await fetch(API_URL1, {
          method: 'POST',
          body: formDataToSend
        });
      } else {
        // Create new brand
        response = await fetch(API_URL1, {
          method: 'POST',
          body: formDataToSend
        });
      }

      const data = await response.json();

      if (data.success) {
        showToast(data.message || (editingBrand ? 'Brand updated successfully' : 'Brand added successfully'), 'success');
        fetchBrands();
        resetForm();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('Operation failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', status: 'active' });
    setEditingBrand(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      image: brand.image,
      status: brand.status
    });
    setEditingBrand(brand);
    setImagePreview(brand.image);
    setImageFile(null);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleStatusToggle = async (brand) => {
    try {
      const newStatus = brand.status === 'active' ? 'inactive' : 'active';
      
      const formDataToSend = new FormData();
      formDataToSend.append('id', brand.id);
      formDataToSend.append('name', brand.name);
      formDataToSend.append('slug', brand.slug);
      formDataToSend.append('description', brand.description || '');
      formDataToSend.append('status', newStatus);
      formDataToSend.append('existingImage', brand.image.replace(API_URL, ''));
      formDataToSend.append('_method', 'PUT');

      const response = await fetch(API_URL1, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        showToast(`Brand ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
        fetchBrands();
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      showToast('Failed to update status', 'error');
    }
    setActiveDropdown(null);
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteConfirm(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL1}?id=${brandToDelete.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast(data.message || 'Brand deleted successfully', 'success');
        fetchBrands();
      } else {
        showToast(data.message || 'Failed to delete brand', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete brand', 'error');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setBrandToDelete(null);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const truncateDescription = (text, length = 40) => {
    if (!text) return '-';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-gray-800 p-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg min-w-[300px] animate-slideIn text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span className="flex-1 font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-80 hover:opacity-100">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  Confirm Delete
                </h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {brandToDelete?.image && (
                    <img src={brandToDelete.image} alt={brandToDelete.name} className="w-16 h-16 rounded-lg object-cover border" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{brandToDelete?.name}</p>
                    <p className="text-sm text-gray-500">{brandToDelete?.slug}</p>
                  </div>
                </div>
                <p className="text-gray-600">Are you sure you want to delete this brand? This will also delete the brand image. This action cannot be undone.</p>
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Deleting...</>
                  ) : (
                    <><i className="fas fa-trash"></i> Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-200">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-[#2d5a27] mb-1 flex items-center gap-3">
              <i className="fas fa-tags"></i>
              Brand Management
            </h1>
            <p className="text-gray-500">Manage all product brands in one place</p>
          </div>
          <button 
            className="bg-[#2d5a27] text-white px-5 py-2.5 rounded-lg hover:bg-[#4a7c59] transition-all active:scale-95 flex items-center gap-2 font-medium shadow-sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Add New Brand
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#2d5a27]/10 text-[#2d5a27] text-2xl">
              <i className="fas fa-tags"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
              <p className="text-gray-500 text-sm">Total Brands</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-100 text-green-600 text-2xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
              <p className="text-gray-500 text-sm">Active Brands</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-red-100 text-red-600 text-2xl">
              <i className="fas fa-pause-circle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.inactive}</h3>
              <p className="text-gray-500 text-sm">Inactive Brands</p>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={resetForm}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-[#2d5a27] flex items-center gap-2">
                  <i className={`fas ${editingBrand ? 'fa-edit' : 'fa-plus-circle'}`}></i>
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h2>
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={resetForm}>
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <i className="fas fa-tag mr-1 text-[#2d5a27]"></i>
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <i className="fas fa-link mr-1 text-[#2d5a27]"></i>
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="brand-slug"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Auto-generated from name</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <i className="fas fa-align-left mr-1 text-[#2d5a27]"></i>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter brand description"
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <i className="fas fa-image mr-1 text-[#2d5a27]"></i>
                    Brand Logo
                  </label>
                  <div className="flex flex-col md:flex-row gap-6 items-start p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <div className="w-36 h-36 rounded-xl overflow-hidden border-2 border-gray-200 bg-white flex items-center justify-center shrink-0 shadow-sm">
                      {imagePreview || formData.image ? (
                        <img 
                          src={imagePreview || formData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23ccc" viewBox="0 0 24 24"%3E%3Cpath d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-400 p-2">
                          <i className="fas fa-image text-4xl mb-2"></i>
                          <p className="text-xs">No image</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d5a27] text-[#2d5a27] rounded-lg cursor-pointer hover:bg-[#2d5a27] hover:text-white font-medium transition-all"
                        >
                          <i className="fas fa-upload"></i> 
                          {imageFile ? 'Change Logo' : 'Upload Logo'}
                        </label>
                        {(imageFile || imagePreview) && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                              setFormData({ ...formData, image: '' });
                            }}
                            className="px-4 py-2 text-red-600 border-2 border-red-300 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                          >
                            <i className="fas fa-trash"></i> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        Recommended: 300x300px | Max: 5MB | JPG, PNG, GIF, WEBP
                      </p>
                      {imageFile && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <i className="fas fa-check-circle"></i>
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <i className="fas fa-toggle-on mr-1 text-[#2d5a27]"></i>
                    Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border-2 ${
                        formData.status === 'active' 
                        ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                      }`}
                      onClick={() => setFormData({...formData, status: 'active'})}
                    >
                      <i className="fas fa-check-circle"></i> Active
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border-2 ${
                        formData.status === 'inactive' 
                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'
                      }`}
                      onClick={() => setFormData({...formData, status: 'inactive'})}
                    >
                      <i className="fas fa-pause-circle"></i> Inactive
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2" 
                    onClick={resetForm}
                    disabled={saving}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 rounded-lg bg-[#2d5a27] text-white font-medium hover:bg-[#4a7c59] transition-all shadow-lg shadow-green-200 disabled:opacity-50 flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> 
                        {editingBrand ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${editingBrand ? 'fa-save' : 'fa-plus-circle'}`}></i> 
                        {editingBrand ? 'Update Brand' : 'Save Brand'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === 'all' 
                ? 'bg-[#2d5a27] text-white border-[#2d5a27] shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              <i className="fas fa-list mr-1"></i> All
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                statusFilter === 'active' 
                ? 'bg-green-600 text-white border-green-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('active')}
            >
              <i className="fas fa-check-circle"></i> Active
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                statusFilter === 'inactive' 
                ? 'bg-red-600 text-white border-red-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('inactive')}
            >
              <i className="fas fa-pause-circle"></i> Inactive
            </button>
          </div>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-list text-[#2d5a27]"></i>
              Brands ({filteredBrands.length})
            </h3>
            <button 
              onClick={fetchBrands}
              className="text-[#2d5a27] border border-[#2d5a27] px-3 py-1.5 rounded-lg text-sm hover:bg-[#2d5a27] hover:text-white font-medium flex items-center gap-2 transition-all"
              disabled={loading}
            >
              <i className={`fas fa-sync ${loading ? 'fa-spin' : ''}`}></i> Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="py-16 text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-[#2d5a27] mb-4"></i>
              <p className="text-gray-500">Loading brands...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-5xl">
                <i className="fas fa-tags"></i>
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-1">No brands found</h4>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first brand'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-[#2d5a27] text-white px-5 py-2 rounded-lg hover:bg-[#4a7c59] transition-all"
                >
                  <i className="fas fa-plus mr-2"></i>Add Brand
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBrands.map(brand => (
                    <tr key={brand.id} className="hover:bg-[#2d5a27]/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm bg-white group-hover:border-[#2d5a27] transition-colors">
                          {brand.image ? (
                            <img 
                              src={brand.image} 
                              alt={brand.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23999" viewBox="0 0 24 24"%3E%3Cpath d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800">{brand.name}</span>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell">
                        <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {brand.slug}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <p className="text-sm text-gray-500 max-w-[200px]" title={brand.description}>
                          {truncateDescription(brand.description)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDateTime(brand.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          brand.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <i className={`fas fa-${brand.status === 'active' ? 'check' : 'pause'}-circle`}></i>
                          {brand.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      
                      {/* Action Icons Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Button */}
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 text-[#2d5a27] hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Brand"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleStatusToggle(brand)}
                            className={`p-2 rounded-lg transition-colors ${
                              brand.status === 'active' 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={brand.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`fas fa-${brand.status === 'active' ? 'pause' : 'play'}-circle`}></i>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(brand)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Brand"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          
                          {/* More Options Dropdown */}
                          <div className="relative">
                            <button 
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              onClick={(e) => toggleDropdown(e, brand.id)}
                              title="More Options"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            
                            {activeDropdown === brand.id && (
                              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden animate-fadeIn">
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                  onClick={() => handleEdit(brand)}
                                >
                                  <i className="fas fa-edit text-[#2d5a27] w-4"></i> Edit Brand
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                  onClick={() => handleStatusToggle(brand)}
                                >
                                  <i className={`fas fa-${brand.status === 'active' ? 'pause' : 'play'}-circle text-orange-500 w-4`}></i>
                                  {brand.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                  onClick={() => {
                                    navigator.clipboard.writeText(brand.slug);
                                    showToast('Slug copied to clipboard', 'success');
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <i className="fas fa-copy text-blue-500 w-4"></i> Copy Slug
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                  onClick={() => handleDeleteClick(brand)}
                                >
                                  <i className="fas fa-trash w-4"></i> Delete Brand
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            <i className="fas fa-info-circle mr-1"></i>
            Showing {filteredBrands.length} of {stats.total} brands
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrandManagement;