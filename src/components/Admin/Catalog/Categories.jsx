import React, { useState } from "react";
import "../../../css/Categories.css";
import { Link } from "react-router-dom";

const initialCategories = [
  {
    id: 1,
    name: "Hair ",
    description: "All hair related products",
    image: "https://via.placeholder.com/400x200",
    products: 4,
    status: "Active",
    type: "Hair",
    subCategories: ["Oil", "Shampoo"],
    seoTitle: "",
    seoDesc: "",
    homepage: true,
  },
  {
    id: 2,
    name: "Skin ",
    description: "Face & skin products",
    image: "https://via.placeholder.com/400x200",
    products: 11,
    status: "Active",
    type: "Skin",
    subCategories: ["Facewash", "Serum"],
    seoTitle: "",
    seoDesc: "",
    homepage: false,
  },
  {
    id: 3,
    name: "Body ",
    description: "Body & massage products",
    image: "https://via.placeholder.com/400x200",
    products: 6,
    status: "Inactive",
    type: "Body",
    subCategories: ["Oil", "Scrub"],
    seoTitle: "",
    seoDesc: "",
    homepage: false,
  },
  {
    id: 4,
    name: "Best Seller",
    description: "Top selling products",
    image: "https://via.placeholder.com/400x200",
    products: 8,
    status: "Active",
    type: "Best Seller",
    subCategories: [],
    seoTitle: "",
    seoDesc: "",
    homepage: true,
  },
  {
    id: 5,
    name: "New Launch",
    description: "Recently launched products",
    image: "https://via.placeholder.com/400x200",
    products: 3,
    status: "Active",
    type: "New Launch",
    subCategories: [],
    seoTitle: "",
    seoDesc: "",
    homepage: true,
  },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
const [editCategory, setEditCategory] = useState(null);
const [showPromote, setShowPromote] = useState(false);
const [showImagePicker, setShowImagePicker] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const [openImageMenu, setOpenImageMenu] = useState(null);




  const toggleStatus = (id) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id
          ? { ...cat, status: cat.status === "Active" ? "Inactive" : "Active" }
          : cat
      )
    );
    setOpenMenu(null);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
    setOpenMenu(null);
  };

  // 🔍 SEARCH FILTER (ONLY ADDITION)
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.type.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

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
        {filteredCategories.map(cat => (
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
                      <div className="danger" onClick={() => deleteCategory(cat.id)}>
                        Delete
                      </div>
                    </div>
                  )}
                </div>
                {editCategory && (
  <div className="edit-overlay">
    <div className="edit-panel">

      <div className="edit-header">
        <h2>Edit Category</h2>
        <div className="header-actions">
          <button className="cancel-btn" onClick={() => setEditCategory(null)}>
            Cancel
          </button>
          <button className="save-btn">Save</button>
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

          <label>Description (Traditional Care)</label>
          <textarea
            rows="4"
            placeholder="Ayurvedic benefits, ingredients, usage..."
            value={editCategory.description}
            onChange={(e) =>
              setEditCategory({ ...editCategory, description: e.target.value })
            }
          />

          <label>Category Image</label>
          <input type="file" />

          <label>Sub Categories</label>
          <input
            value={editCategory.subCategories.join(", ")}
            readOnly
          />
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
                  status:
                    editCategory.status === "Active"
                      ? "Inactive"
                      : "Active",
                })
              }
            />
          </div>

          <div className="seo-box">
            <h3>Marketing & SEO</h3>

            <label>SEO Title</label>
            <input
              value={editCategory.seoTitle}
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
              value={editCategory.seoDesc}
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


{showPromote && (
  <div className="promote-overlay">
    <div className="promote-modal">

      {/* HEADER */}
      <div className="promote-header">
        <div>
          <h2>Promote Your Category</h2>
          <p>
            Grow your <b>Traditional Care</b> category using ready-made
            promotional templates.
          </p>
        </div>
        <button className="close-btn" onClick={() => setShowPromote(false)}>✕</button>
      </div>

      {/* CONTENT */}
      <div className="promote-grid">

        {/* SOCIAL POST */}
        <div className="promote-card">
          <div className="icon-circle green">📢</div>
          <h3>Social Media Post</h3>
          <p>
            Promote Ayurvedic & herbal products on Instagram, Facebook &
            WhatsApp with AI-written captions.
          </p>

          <ul>
            <li>✔ Organic benefits highlight</li>
            <li>✔ Before/After messaging</li>
            <li>✔ Festival & offer ready</li>
          </ul>

          <button className="primary-btn">Create Post with AI</button>
        </div>

        {/* EMAIL */}
        <div className="promote-card">
          <div className="icon-circle blue">✉️</div>
          <h3>Email Campaign</h3>
          <p>
            Send beautifully designed emails showcasing Traditional Care
            products to your subscribers.
          </p>

          <ul>
            <li>✔ Herbal ingredient focus</li>
            <li>✔ Product benefits & usage</li>
            <li>✔ CTA ready (Shop Now)</li>
          </ul>

          <button className="outline-btn">Create Email Campaign</button>
        </div>

        {/* GOOGLE ADS */}
        <div className="promote-card">
          <div className="icon-circle yellow">💰</div>
          <h3>Google Ads</h3>
          <p>
            Increase visibility for your category on Google search with
            Ayurvedic keywords.
          </p>

          <ul>
            <li>✔ Hair / Skin / Body keywords</li>
            <li>✔ Low competition ads</li>
            <li>✔ Conversion focused</li>
          </ul>

          <button className="outline-btn">Create Ad Campaign</button>
        </div>

      </div>

    </div>
  </div>
)}


{showImagePicker && (
  <div className="image-picker-overlay">
    <div className="image-picker-modal">

      {/* HEADER */}
      <div className="image-picker-header">
        <h2>Choose Category Image</h2>
        <button className="close-btn" onClick={() => setShowImagePicker(false)}>✕</button>
      </div>

      {/* BODY */}
      <div className="image-picker-body">

        {/* LEFT */}
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

  {/* THREE DOT */}
  <div
    className="image-actions"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={() =>
        setOpenImageMenu(openImageMenu === i ? null : i)
      }
    >
      ⋮
    </button>
  </div>

  {/* DROPDOWN MENU */}
  {openImageMenu === i && (
    <div
      className="image-context-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <div>🌿 Use as Category Banner</div>
      <div>✏ Rename Image</div>
      <div>🖼 Crop & Edit</div>
      <div>🎥 Create Promo Video</div>
      <div>🧼 Remove Background</div>
      <div className="divider" />
      <div>📋 Copy Image URL</div>
      <div>⬇ Download</div>
      <div className="danger">🗑 Move to Trash</div>
    </div>
  )}
</div>

            ))}
          </div>

          {selectedImage && (
            <div className="selected-info">
              ✅ Selected image ready to replace category banner
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="image-right">
          <h4>Image Guidelines</h4>
          <ul>
            <li>Natural & Ayurvedic look</li>
            <li>Green / earthy tones preferred</li>
            <li>No heavy text on image</li>
            <li>High quality product focus</li>
          </ul>

          <div className="brand-note">
            Best for <b>Traditional Care</b> categories
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
        ))}
      </div>
    </div>
  );
}
