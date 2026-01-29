import React, { useState, useEffect } from 'react';

const BrandManagement = () => {
  const initialBrands = [
    {
      id: 1,
      name: 'Himalaya Herbals',
      slug: 'himalaya-herbals',
      description: 'Authentic Ayurvedic products from the Himalayas',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=150&h=150&fit=crop',
      status: 'active'
    },
    {
      id: 2,
      name: 'Forest Essentials',
      slug: 'forest-essentials',
      description: 'Luxury Ayurveda and natural skincare products',
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=150&h=150&fit=crop',
      status: 'active'
    },
    {
      id: 3,
      name: 'Kama Ayurveda',
      slug: 'kama-ayurveda',
      description: 'Traditional Ayurvedic beauty and wellness',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Organic India',
      slug: 'organic-india',
      description: 'Certified organic herbal supplements',
      image: 'https://images.unsplash.com/photo-1581270144601-50c5334b0d10?w=150&h=150&fit=crop',
      status: 'active'
    },
    {
      id: 5,
      name: 'Vicco Labs',
      slug: 'vicco-labs',
      description: 'Ayurvedic toothpaste and skincare',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=150&h=150&fit=crop',
      status: 'inactive'
    }
  ];

  // State management
  const [brands, setBrands] = useState(initialBrands);
  const [filteredBrands, setFilteredBrands] = useState(initialBrands);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active'
  });

  // Stats calculation
  const totalBrands = brands.length;
  const activeBrands = brands.filter(brand => brand.status === 'active').length;
  const inactiveBrands = brands.filter(brand => brand.status === 'inactive').length;

  // Filter and search effect
  useEffect(() => {
    let result = brands;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(brand => brand.status === statusFilter);
    }
    
    setFilteredBrands(result);
  }, [searchTerm, statusFilter, brands]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Form handling
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    if (editingBrand) {
      const updatedBrands = brands.map(brand => 
        brand.id === editingBrand.id ? { ...formData, id: editingBrand.id } : brand
      );
      setBrands(updatedBrands);
      showToast('Brand updated successfully', 'success');
    } else {
      const newBrand = {
        ...formData,
        id: brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1
      };
      setBrands([...brands, newBrand]);
      showToast('Brand added successfully', 'success');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', status: 'active' });
    setEditingBrand(null);
    setShowForm(false);
  };

  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      image: brand.image,
      status: brand.status
    });
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleStatusToggle = (brandId) => {
    const updatedBrands = brands.map(brand => 
      brand.id === brandId 
        ? { ...brand, status: brand.status === 'active' ? 'inactive' : 'active' }
        : brand
    );
    setBrands(updatedBrands);
    showToast('Brand status updated', 'success');
  };

  const handleDeleteClick = (brandId) => {
    setBrandToDelete(brandId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedBrands = brands.filter(brand => brand.id !== brandToDelete);
    setBrands(updatedBrands);
    showToast('Brand deleted successfully', 'success');
    setShowDeleteConfirm(false);
    setBrandToDelete(null);
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
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
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
                <h3 className="text-xl font-bold text-[#2d5a27]">Confirm Delete</h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Are you sure you want to delete this brand? This action cannot be undone.</p>
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-200">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-[#2d5a27] mb-1">Brand Management</h1>
            <p className="text-gray-500">Manage all product brands in one place</p>
          </div>
          <button 
            className="bg-[#2d5a27] text-white px-5 py-2.5 rounded-lg hover:bg-[#4a7c59] transition-transform active:scale-95 flex items-center gap-2 font-medium shadow-sm"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Brand
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#2d5a27]/10 text-[#2d5a27] text-2xl">
              <i className="fas fa-tags"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{totalBrands}</h3>
              <p className="text-gray-500 text-sm">Total Brands</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-100 text-green-600 text-2xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{activeBrands}</h3>
              <p className="text-gray-500 text-sm">Active Brands</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-red-100 text-red-600 text-2xl">
              <i className="fas fa-pause-circle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{inactiveBrands}</h3>
              <p className="text-gray-500 text-sm">Inactive Brands</p>
            </div>
          </div>
        </div>

        {/* Add/Edit Brand Form (Modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={resetForm}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-[#2d5a27]">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors" onClick={resetForm}>
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Brand Name *</label>
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
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="brand-slug"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">SEO-friendly URL identifier</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter brand description"
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Brand Image</label>
                  <div className="flex flex-col md:flex-row gap-6 items-start p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <div className="w-36 h-36 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center shrink-0">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-400 p-2">
                          <i className="fas fa-image text-3xl mb-2"></i>
                          <p className="text-xs">No image</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#2d5a27] text-[#2d5a27] rounded-lg cursor-pointer hover:bg-[#2d5a27]/5 font-medium transition-colors"
                        >
                          <i className="fas fa-upload"></i> Upload Image
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Recommended size: 300x300px. Supports JPG, PNG.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border ${
                        formData.status === 'active' 
                        ? 'bg-[#2d5a27] text-white border-[#2d5a27]' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#2d5a27]'
                      }`}
                      onClick={() => setFormData({...formData, status: 'active'})}
                    >
                      <i className="fas fa-check-circle"></i> Active
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all border ${
                        formData.status === 'inactive' 
                        ? 'bg-[#2d5a27] text-white border-[#2d5a27]' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#2d5a27]'
                      }`}
                      onClick={() => setFormData({...formData, status: 'inactive'})}
                    >
                      <i className="fas fa-pause-circle"></i> Inactive
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#2d5a27] text-white font-medium hover:bg-[#4a7c59] transition-colors shadow-sm">
                    {editingBrand ? 'Update Brand' : 'Save Brand'}
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
              placeholder="Search brands by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'all' 
                ? 'bg-[#2d5a27] text-white border-[#2d5a27]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              All Brands
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                statusFilter === 'active' 
                ? 'bg-[#2d5a27] text-white border-[#2d5a27]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('active')}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'active' ? 'bg-white' : 'bg-green-500'}`}></span> Active
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                statusFilter === 'inactive' 
                ? 'bg-[#2d5a27] text-white border-[#2d5a27]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter('inactive')}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'inactive' ? 'bg-white' : 'bg-red-500'}`}></span> Inactive
            </button>
          </div>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">Brands ({filteredBrands.length})</h3>
            <button className="text-[#2d5a27] border border-[#2d5a27] px-3 py-1.5 rounded-lg text-sm hover:bg-[#2d5a27]/5 font-medium flex items-center gap-2">
              <i className="fas fa-sort-alpha-down"></i> Sort A-Z
            </button>
          </div>
          
          {filteredBrands.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                <i className="fas fa-tags"></i>
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-1">No brands found</h4>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBrands.map(brand => (
                    <tr key={brand.id} className="hover:bg-[#2d5a27]/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800">{brand.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono hidden md:table-cell">{brand.slug}</td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        <p className="text-sm text-gray-500 max-w-[200px] truncate" title={brand.description}>
                          {truncateDescription(brand.description)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          brand.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <i className={`fas fa-${brand.status === 'active' ? 'check' : 'pause'}-circle text-[10px]`}></i>
                          {brand.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={(e) => toggleDropdown(e, brand.id)}
                        >
                          <i className="fas fa-ellipsis-v">...</i>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === brand.id && (
                          <div className="absolute right-6 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden animate-fadeIn">
                            <button 
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              onClick={() => handleEdit(brand)}
                            >
                              <i className="fas fa-edit text-[#2d5a27]"></i> Edit Brand
                            </button>
                            <button 
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              onClick={() => handleStatusToggle(brand.id)}
                            >
                              <i className={`fas fa-${brand.status === 'active' ? 'pause' : 'play'}-circle text-[#2d5a27]`}></i>
                              {brand.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-50"
                              onClick={() => handleDeleteClick(brand.id)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandManagement;