import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/products";
const categories = ["Accessories & Bouquet", "Bags", "Clothing", "Home Decor"];

const crudStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');

  :root {
    --cream: #fdf6ec;
    --warm-white: #fffbf5;
    --blush: #f4a7b2;
    --rose: #e8728a;
    --deep-rose: #c4556b;
    --terracotta: #d4735e;
    --amber: #e8a45a;
    --sage: #8aab8e;
    --charcoal: #2c2420;
    --muted: #8a7a74;
    --border: rgba(212, 115, 94, 0.15);
  }

     /* ─── HEADER ─── */
  .ch-header {
    position: relative;
    padding: 0;
    overflow: hidden;
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    margin-left: -20%;
    width: 121%;
    margin-top: -40px;
  }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    margin-right: -231px;
    margin-top: 10px;
  }

  .ch-logo-block {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ch-logo-yarn {
    font-size: 2.8rem;
    animation: sway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }

  .ch-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    line-height: 1;
  }

  .ch-logo-text span {
    color: var(--rose);
  }

  .ch-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
    font-weight: 400;
  }
  .ch-crud {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-crud-header {
    margin-bottom: 40px;
  }

  .ch-crud-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--terracotta);
    font-weight: 700;
    margin-bottom: 10px;
  }

  .ch-crud-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-crud-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .ch-crud-title em { font-style: italic; color: var(--rose); }

  /* ── ADD FORM ── */
  .ch-add-form {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 44px;
    overflow: hidden;
  }

  .ch-form-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-form-head-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--rose), var(--blush));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .ch-form-head-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-form-body {
    padding: 28px;
  }

  .ch-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 18px;
    margin-bottom: 22px;
  }

  .ch-form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ch-form-label {
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  .ch-form-input {
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    background: var(--cream);
    color: var(--charcoal);
    font-family: 'Lato', sans-serif;
    font-size: 0.86rem;
    font-weight: 400;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    outline: none;
    width: 100%;
  }

  .ch-form-input:focus {
    border-color: var(--rose);
    box-shadow: 0 0 0 3px rgba(232, 114, 138, 0.1);
  }

  .ch-form-input::placeholder { color: var(--muted); opacity: 0.6; }

  .ch-form-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
  }

  .ch-form-img-area {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ch-img-label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .ch-img-label:hover { border-color: var(--rose); color: var(--rose); }

  .ch-btn-toggle-imgs {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 6px;
    transition: color 0.15s ease;
  }

  .ch-btn-toggle-imgs:hover { color: var(--rose); }

  .ch-btn-add {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-btn-add::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.28s ease;
  }

  .ch-btn-add:hover::after { transform: translateX(0); }
  .ch-btn-add span { position: relative; z-index: 1; }
  .ch-btn-add:hover { color: #fff; }

  /* Image previews */
  .ch-img-preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .ch-img-thumb-wrap {
    position: relative;
    width: 88px;
    height: 88px;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .ch-img-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ch-img-thumb-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(44, 36, 32, 0.7);
    color: #fff;
    border: none;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
    line-height: 1;
    padding: 0;
  }

  .ch-img-thumb-remove:hover { background: var(--rose); }

  /* ── PRODUCTS SECTION ── */
  .ch-products-section {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .ch-cat-group {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-cat-group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.5);
  }

  .ch-cat-group-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-cat-group-count {
    background: rgba(232, 114, 138, 0.1);
    color: var(--rose);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .ch-product-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1px;
    background: var(--border);
  }

  .ch-product-card {
    background: var(--warm-white);
    padding: 22px;
    transition: background 0.15s ease;
  }

  .ch-product-card:hover { background: rgba(253, 246, 236, 0.7); }

  .ch-product-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 6px;
  }

  .ch-product-card-desc {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.55;
    margin-bottom: 10px;
    font-weight: 300;
  }

  .ch-product-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 16px;
  }

  .ch-card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ch-btn-view-img {
    padding: 7px 14px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-view-img:hover { border-color: var(--amber); color: var(--terracotta); }

  .ch-btn-edit {
    padding: 7px 14px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-edit:hover { border-color: var(--rose); color: var(--rose); }

  .ch-btn-delete {
    padding: 7px 14px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-delete:hover { border-color: #c0392b; color: #c0392b; }

  /* Edit form inside card */
  .ch-edit-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ch-edit-input {
    padding: 9px 12px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    background: var(--cream);
    color: var(--charcoal);
    font-family: 'Lato', sans-serif;
    font-size: 0.84rem;
    outline: none;
    width: 100%;
    transition: border-color 0.15s ease;
  }

  .ch-edit-input:focus { border-color: var(--rose); }

  .ch-edit-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .ch-btn-save {
    padding: 8px 18px;
    background: var(--rose);
    color: #fff;
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s ease;
  }

  .ch-btn-save:hover { background: var(--deep-rose); }

  .ch-btn-cancel {
    padding: 8px 18px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-cancel:hover { border-color: var(--rose); color: var(--rose); }

  /* Modal */
  .ch-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(44, 36, 32, 0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
  }

  .ch-modal-box {
    background: var(--warm-white);
    border-radius: 6px;
    padding: 40px 36px;
    max-width: 440px;
    width: 90%;
    text-align: center;
    box-shadow: 0 30px 80px rgba(44, 36, 32, 0.22);
    border: 1px solid var(--border);
    font-family: 'Lato', sans-serif;
    animation: modalIn 0.22s ease;
  }

  @keyframes modalIn {
    from { opacity: 0; transform: translateY(14px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ch-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 10px;
  }

  .ch-modal-desc {
    font-size: 0.86rem;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 28px;
    font-weight: 300;
  }

  .ch-modal-desc strong { color: var(--charcoal); font-weight: 700; }

  .ch-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .ch-modal-img-wrap {
    position: relative;
    margin-bottom: 16px;
  }

  .ch-modal-img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 3px;
    object-fit: contain;
    border: 1px solid var(--border);
  }

  .ch-modal-img-counter {
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .ch-modal-nav {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .ch-modal-nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--charcoal);
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .ch-modal-nav-btn:hover { border-color: var(--rose); color: var(--rose); }

  .ch-btn-danger {
    padding: 11px 24px;
    background: #c0392b;
    color: #fff;
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s ease;
  }

  .ch-btn-danger:hover { background: #a93226; }

  .ch-btn-neutral {
    padding: 11px 24px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-neutral:hover { border-color: var(--rose); color: var(--rose); }

  .ch-crud-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .ch-crud-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chSpin 0.8s linear infinite;
  }

  @keyframes chSpin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .ch-crud { padding: 32px 20px; }
    .ch-form-grid { grid-template-columns: 1fr; }
    .ch-product-cards { grid-template-columns: 1fr; }
  }

  /* ─── FOOTER ─── */
  .ch-footer {
    position: relative;
    z-index: 1;
    background: var(--warm-white);
    border-top: 1px solid var(--border);
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: -5%;
    width: 98.5%;
    margin-bottom: -17.5px;
  }

  .ch-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ch-footer-copy {
    font-size: 0.78rem;
    color: var(--muted);
    letter-spacing: 0.04em;
  }
`;

const CrudApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ id: "", name: "", description: "", price: "", category: "", images: [] });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({ id: "", name: "", description: "", price: "", category: "", images: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [productToShow, setProductToShow] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNewImageList, setShowNewImageList] = useState(false);
  const [showEditImageList, setShowEditImageList] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.id || !newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) return;
    const response = await axios.post(API_URL, newProduct);
    setProducts([...products, response.data]);
    setNewProduct({ id: "", name: "", description: "", price: "", category: "", images: [] });
    setShowNewImageList(false);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setEditProduct(product);
  };

  const updateProduct = async (id) => {
    await axios.put(`${API_URL}/${id}`, editProduct);
    setProducts(products.map((p) => (p.id === id ? editProduct : p)));
    setEditingProduct(null);
    setEditProduct({ id: "", name: "", description: "", price: "", category: "", images: [] });
  };

  const handleImgUpload = (files, setter, current) => {
    const promises = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(promises).then((dataUrls) => setter({ ...current, images: [...current.images, ...dataUrls] }));
  };

  const groupedProducts = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="ch-crud">
        <style>{crudStyles}</style>
        <div className="ch-crud-loading">
          <div className="ch-crud-loader" />
          <span>Loading products…</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <header className="ch-header">
          <div className="ch-header-inner">
            <div className="ch-logo-block">
              <span className="ch-logo-yarn">🧶</span>
              <div>
                <div className="ch-logo-text">Crochet <span>Haven</span></div>
                <div className="ch-tagline">Stitched with love, for you</div>
              </div>
            </div>
          </div>
        </header>
      <style>{crudStyles}</style>
      <div className="ch-crud">
        {/* Header */}
        <div className="ch-crud-header">
          <p className="ch-crud-eyebrow">Inventory</p>
          <h1 className="ch-crud-title">
            Manage <em>Products</em>
          </h1>
        </div>

        {/* ── Add Product Form ── */}
        <div className="ch-add-form">
          <div className="ch-form-head">
            <div className="ch-form-head-icon">✦</div>
            <span className="ch-form-head-title">Add New Product</span>
          </div>
          <div className="ch-form-body">
            <div className="ch-form-grid">
              <div className="ch-form-group">
                <label className="ch-form-label">Product ID</label>
                <input className="ch-form-input" placeholder="e.g. PROD-001"
                  value={newProduct.id} onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })} />
              </div>
              <div className="ch-form-group">
                <label className="ch-form-label">Product Name</label>
                <input className="ch-form-input" placeholder="e.g. Rose Bouquet Amigurumi"
                  value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="ch-form-group">
                <label className="ch-form-label">Description</label>
                <input className="ch-form-input" placeholder="A short description…"
                  value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="ch-form-group">
                <label className="ch-form-label">Price (₱)</label>
                <input className="ch-form-input" placeholder="0.00" type="number"
                  value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              </div>
              <div className="ch-form-group">
                <label className="ch-form-label">Category</label>
                <select className="ch-form-input" value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="">Select category…</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="ch-form-actions">
              <div className="ch-form-img-area">
                <label className="ch-img-label">
                  🖼 Choose Images{newProduct.images.length > 0 ? ` (${newProduct.images.length})` : ""}
                  <input type="file" multiple style={{ display: "none" }}
                    onChange={(e) => handleImgUpload(e.target.files, setNewProduct, newProduct)} />
                </label>
                {newProduct.images.length > 0 && (
                  <button className="ch-btn-toggle-imgs" onClick={() => setShowNewImageList(!showNewImageList)}>
                    {showNewImageList ? "🙈" : "👁"}
                  </button>
                )}
              </div>
              <button className="ch-btn-add" onClick={addProduct}>
                <span>+ Add Product</span>
              </button>
            </div>

            {showNewImageList && newProduct.images.length > 0 && (
              <div className="ch-img-preview-grid">
                {newProduct.images.map((img, idx) => (
                  <div key={idx} className="ch-img-thumb-wrap">
                    <img src={img} alt={`Preview ${idx + 1}`} className="ch-img-thumb" />
                    <button className="ch-img-thumb-remove"
                      onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, i) => i !== idx) })}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Product Groups ── */}
        <div className="ch-products-section">
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="ch-cat-group">
              <div className="ch-cat-group-head">
                <span className="ch-cat-group-name">{category}</span>
                <span className="ch-cat-group-count">{groupedProducts[category].length} items</span>
              </div>
              <div className="ch-product-cards">
                {groupedProducts[category].map((product) => (
                  <div key={product.id} className="ch-product-card">
                    {editingProduct === product.id ? (
                      <div className="ch-edit-form">
                        {[
                          { key: "name", placeholder: "Product name" },
                          { key: "description", placeholder: "Description" },
                          { key: "price", placeholder: "Price" },
                        ].map(({ key, placeholder }) => (
                          <input key={key} className="ch-edit-input" placeholder={placeholder}
                            value={editProduct[key]}
                            onChange={(e) => setEditProduct({ ...editProduct, [key]: e.target.value })} />
                        ))}
                        <select className="ch-edit-input" value={editProduct.category}
                          onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>
                          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>

                        {/* Image edit */}
                        <div>
                          <label className="ch-img-label" style={{ display: "inline-flex", cursor: "pointer" }}>
                            🖼 Images {editProduct.images.length > 0 ? `(${editProduct.images.length})` : ""}
                            <input type="file" multiple style={{ display: "none" }}
                              onChange={(e) => handleImgUpload(e.target.files, setEditProduct, editProduct)} />
                          </label>
                          {editProduct.images.length > 0 && (
                            <button className="ch-btn-toggle-imgs" style={{ marginLeft: 8 }}
                              onClick={() => setShowEditImageList(!showEditImageList)}>
                              {showEditImageList ? "🙈" : "👁"}
                            </button>
                          )}
                        </div>
                        {showEditImageList && editProduct.images.length > 0 && (
                          <div className="ch-img-preview-grid">
                            {editProduct.images.map((img, idx) => (
                              <div key={idx} className="ch-img-thumb-wrap">
                                <img src={img} alt="" className="ch-img-thumb" />
                                <button className="ch-img-thumb-remove"
                                  onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, i) => i !== idx) })}>
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="ch-edit-actions">
                          <button className="ch-btn-save" onClick={() => updateProduct(product.id)}>Save</button>
                          <button className="ch-btn-cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="ch-product-card-name">{product.name}</div>
                        <div className="ch-product-card-desc">{product.description}</div>
                        <div className="ch-product-card-price">₱{parseFloat(product.price).toFixed(2)}</div>
                        <div className="ch-card-actions">
                          {product.images.length > 0 && (
                            <button className="ch-btn-view-img"
                              onClick={() => { setProductToShow(product); setCurrentImageIndex(0); setShowImageModal(true); }}>
                              View Img
                            </button>
                          )}
                          <button className="ch-btn-edit" onClick={() => startEditing(product)}>Edit</button>
                          <button className="ch-btn-delete"
                            onClick={() => { setProductToDelete(product); setShowDeleteModal(true); }}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="ch-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}>
            <div className="ch-modal-box">
              <div className="ch-modal-title">Delete Product?</div>
              <p className="ch-modal-desc">
                Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This cannot be undone.
              </p>
              <div className="ch-modal-actions">
                <button className="ch-btn-neutral" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="ch-btn-danger" onClick={() => { deleteProduct(productToDelete.id); setShowDeleteModal(false); }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && productToShow && (
          <div className="ch-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowImageModal(false)}>
            <div className="ch-modal-box">
              <div className="ch-modal-title">{productToShow.name}</div>
              {productToShow.images.length > 0 ? (
                <>
                  <div className="ch-modal-img-counter">
                    {currentImageIndex + 1} / {productToShow.images.length}
                  </div>
                  <div className="ch-modal-img-wrap">
                    <img src={productToShow.images[currentImageIndex]} alt={productToShow.name} className="ch-modal-img" />
                  </div>
                  {productToShow.images.length > 1 && (
                    <div className="ch-modal-nav">
                      <button className="ch-modal-nav-btn"
                        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + productToShow.images.length) % productToShow.images.length)}>
                        ‹
                      </button>
                      <button className="ch-modal-nav-btn"
                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % productToShow.images.length)}>
                        ›
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="ch-modal-desc">No images available</p>
              )}
              <div className="ch-modal-actions">
                <button className="ch-btn-neutral" onClick={() => setShowImageModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>
    </>
  );
};

export default CrudApp;