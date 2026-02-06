import React, { useState, useEffect } from "react";
import "../../../css/Categories.css";
import { Link } from "react-router-dom";
import { 
  fetchCategories, 
  updateCategory, 
  deleteCategory, 
  toggleCategoryStatus 
} from "../../../api/categoryApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [showPromote, setShowPromote] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageMenu, setOpenImageMenu] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories(search);
    setCategories(data);
    setLoading(false);
  };

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle status
  const toggleStatus = async (id) => {
    const category = categories.find(cat => cat.id === id);
    const result = await toggleCategoryStatus(id, category.status);
    
    if (result.success) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === id
            ? { ...cat, status: cat.status === "Active" ? "Inactive" : "Active" }
            : cat
        )
      );
    } else {
      alert(result.message);
    }
    setOpenMenu(null);
  };

  // Delete category
  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteCategory(id);
      
      if (result.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        alert('Category deleted successfully');
      } else {
        alert(result.message);
      }
    }
    setOpenMenu(null);
  };

  // Save edited category
  const saveEditedCategory = async () => {
    const result = await updateCategory(editCategory);
    
    if (result.success) {
      // Update local state
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editCategory.id ? editCategory : cat
        )
      );
      setEditCategory(null);
      alert('Category updated successfully');
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="category-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">

      {/* HEADER + SEARCH */}
      <div className="category-header">
        <h1>Categories</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "200px"
            }}
          />
          <Link to="/admin/addcategory" className="add-btn">+ Add Category</Link>
        </div>
      </div>

      <div className="category-grid">
        {categories.length > 0 ? categories.map(cat => (
          <div className="category-card" key={cat.id}>

            {/* IMAGE + STATUS + THREE DOT */}
            <div className="category-image-wrapper">
              <img src={cat.image} alt={cat.name} />

              <div className="status-action-bar">
                <span className={`category-status ${cat.status === "Active" ? "active" : "inactive"}`}>
                  {cat.status}
                </span>

                <div className="action-dots">
                  <button onClick={() => setOpenMenu(openMenu === cat.id ? null : cat.id)}>
                    ⋮
                  </button>

                  {openMenu === cat.id && (
                    <div className="dropdown">
                      <div onClick={() => setEditCategory(cat)}>Edit</div>
                      <div onClick={() => setShowPromote(true)}>Promote</div> 
                      <div onClick={() => {
                        setShowImagePicker(true);
                        setOpenMenu(null);
                      }}>
                        Replace Image
                      </div>
                      <div onClick={() => toggleStatus(cat.id)}>
                        {cat.status === "Active" ? "Deactivate" : "Activate"}
                      </div>
                      <div className="danger" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="category-body">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>

              <div className="meta">
                <span>{cat.products} Products</span>
                <span className="type-badge">{cat.type}</span>
              </div>
            </div>

          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>No categories found</p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editCategory && (
        <div className="edit-overlay">
          <div className="edit-panel">
            <div className="edit-header">
              <h2>Edit Category</h2>
              <div className="header-actions">
                <button className="cancel-btn" onClick={() => setEditCategory(null)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={saveEditedCategory}>
                  Save
                </button>
              </div>
            </div>

            <div className="edit-content">
              <div className="edit-left">
                <h3>Category Info</h3>

                <label>Category Name</label>
                <input
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                />

                <label>Description</label>
                <textarea
                  rows="4"
                  value={editCategory.description}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, description: e.target.value })
                  }
                />

                <label>Type</label>
                <select
                  value={editCategory.type}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, type: e.target.value })
                  }
                >
                  <option>Main Category</option>
                  <option>Hair</option>
                  <option>Skin</option>
                  <option>Body</option>
                  <option>Best Seller</option>
                  <option>New Launch</option>
                </select>
              </div>

              <div className="edit-right">
                <div className="toggle-box">
                  <span>Active on Website</span>
                  <input
                    type="checkbox"
                    checked={editCategory.status === "Active"}
                    onChange={() =>
                      setEditCategory({
                        ...editCategory,
                        status: editCategory.status === "Active" ? "Inactive" : "Active",
                      })
                    }
                  />
                </div>

                <div className="seo-box">
                  <h3>SEO Settings</h3>

                  <label>SEO Title</label>
                  <input
                    value={editCategory.seoTitle || ''}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        seoTitle: e.target.value,
                      })
                    }
                  />

                  <label>Meta Description</label>
                  <textarea
                    rows="3"
                    value={editCategory.seoDesc || ''}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        seoDesc: e.target.value,
                      })
                    }
                  />

                  <label>Show on Homepage</label>
                  <select
                    value={editCategory.homepage ? "Yes" : "No"}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        homepage: e.target.value === "Yes",
                      })
                    }
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTE MODAL */}
      {showPromote && (
        <div className="promote-overlay">
          <div className="promote-modal">
            <div className="promote-header">
              <div>
                <h2>Promote Your Category</h2>
                <p>Grow your category using promotional templates.</p>
              </div>
              <button className="close-btn" onClick={() => setShowPromote(false)}>✕</button>
            </div>

            <div className="promote-grid">
              <div className="promote-card">
                <div className="icon-circle green">📢</div>
                <h3>Social Media Post</h3>
                <p>Promote on Instagram, Facebook & WhatsApp</p>
                <button className="primary-btn">Create Post</button>
              </div>

              <div className="promote-card">
                <div className="icon-circle blue">✉️</div>
                <h3>Email Campaign</h3>
                <p>Send emails to your subscribers</p>
                <button className="outline-btn">Create Campaign</button>
              </div>

              <div className="promote-card">
                <div className="icon-circle yellow">💰</div>
                <h3>Google Ads</h3>
                <p>Increase visibility on Google</p>
                <button className="outline-btn">Create Ad</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PICKER MODAL */}
      {showImagePicker && (
        <div className="image-picker-overlay">
          <div className="image-picker-modal">
            <div className="image-picker-header">
              <h2>Choose Category Image</h2>
              <button className="close-btn" onClick={() => setShowImagePicker(false)}>✕</button>
            </div>

            <div className="image-picker-body">
              <div className="image-left">
                <div className="upload-box">
                  <label className="upload-btn">
                    + Upload Image
                    <input type="file" hidden />
                  </label>
                  <p>JPG / PNG • Recommended 1200×600</p>
                </div>

                <div className="image-grid">
                  {[1,2,3,4,5].map((i) => (
                    <div
                      key={i}
                      className={`image-item ${selectedImage === i ? "selected" : ""}`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <img
                        src={`https://via.placeholder.com/300x180?text=Image+${i}`}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="image-right">
                <h4>Image Guidelines</h4>
                <ul>
                  <li>High quality images</li>
                  <li>Clear product visibility</li>
                  <li>Consistent branding</li>
                </ul>
              </div>
            </div>

            <div className="image-picker-footer">
              <button className="cancel-btn" onClick={() => setShowImagePicker(false)}>
                Cancel
              </button>
              <button
                className="save-btn"
                disabled={!selectedImage}
                onClick={() => setShowImagePicker(false)}
              >
                Replace Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}